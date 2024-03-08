using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Timelogger.Entities;

namespace Timelogger.Api.Controllers
{
	[Route("api/[controller]")]
	public class ProjectsController : Controller
	{
		private readonly ApiContext _context;

		public ProjectsController(ApiContext context)
		{
			_context = context;
		}

		// GET api/projects
		[HttpGet]
		public async Task<IActionResult> Get([FromQuery] string sortby, [FromQuery] string order)
		{
			var projects = _context.Projects;

			// Apply sorting only if both sortby and order are provided
			if (!string.IsNullOrEmpty(sortby) && !string.IsNullOrEmpty(order))
			{
				if (sortby.ToLower() == "deadline" && (order.ToLower() == "asc" || order.ToLower() == "desc"))
				{
					// Use asynchronous operation with await and directly return the data as an array or list
					if (order.ToLower() == "asc")
						return Ok(await projects.OrderBy(p => p.Deadline).ToListAsync());
					else
						return Ok(await projects.OrderByDescending(p => p.Deadline).ToListAsync());
				}
			}

			// Use ToListAsync and await it to asynchronously fetch the projects and return as a list
			return Ok(await projects.ToListAsync());
		}

		[HttpPost]
		public async Task<ActionResult<Project>> Post([FromBody] Project project)
		{
			if (!ModelState.IsValid)
			{
				var errors = ModelState.SelectMany(x => x.Value.Errors.Select(p => p.ErrorMessage));
				foreach (var error in errors)
				{
					Console.WriteLine(error);
				}
				return BadRequest("Invalid request");
			}
			
			Console.WriteLine(project);
			_context.Projects.Add(project);
			await _context.SaveChangesAsync();

			return CreatedAtAction(nameof(Get), new { id = project.Id }, project);
		}

		// NOTE: Not including PUT and DELTE to simplify the solution

		/* This block includes controller for time registration */

		[HttpGet("{projectId}/TimeRegistrations")]
		public async Task<ActionResult<TimeRegistration>> GetTimeRegistrations(int projectId)
		{
			var timeRegistrations = await _context.TimeRegistrations
										.Where(tr => tr.ProjectId == projectId)
										.ToListAsync();

			if (timeRegistrations == null)
			{
				return NotFound();
			}

			return Ok(timeRegistrations);
		}


		[HttpPost("{projectId}/TimeRegistrations")]
		public async Task<ActionResult<TimeRegistration>> PostTimeRegistration(int projectId, [FromBody]TimeRegistration timeRegistration)
		{

			if (!ModelState.IsValid)
			{
				var errors = ModelState.SelectMany(x => x.Value.Errors.Select(p => p.ErrorMessage));
				foreach (var error in errors)
				{
					Console.WriteLine(error);
				}
				
				Console.WriteLine(ModelState);
				return BadRequest("Invalid request");
			}

			var project = await _context.Projects.FindAsync(projectId);
			if (project == null)
			{
				return NotFound();
			}

			if (project.IsComplete)
			{
				return BadRequest("Time registration is not allowed to a completed project.");
			}

			timeRegistration.ProjectId = projectId;
			_context.TimeRegistrations.Add(timeRegistration);
			await _context.SaveChangesAsync();

			return CreatedAtAction("GetTimeRegistrations", new { id = timeRegistration.Id }, timeRegistration);
		}

	}
}
