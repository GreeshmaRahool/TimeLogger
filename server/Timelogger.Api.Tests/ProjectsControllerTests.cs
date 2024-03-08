using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using System;
using System.Linq;
using System.Threading.Tasks;
using Timelogger.Api.Controllers;
using Timelogger.Entities;
using System.Collections.Generic;

namespace Timelogger.Api.Tests
{
    [TestFixture]
    public class ProjectsControllerTests
    {
        private ApiContext _context;
        private ProjectsController _controller;

        [SetUp]
        public void Setup()
        {
            // Setup in-memory database
            var options = new DbContextOptionsBuilder<ApiContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // Use a unique name to ensure a fresh database for each test
                .Options;
            _context = new ApiContext(options);

            // Seed the database with test data
            _context.Projects.Add(new Project { Id = 1, Name = "Project 1", Deadline = DateTime.Now.AddDays(10) });
            _context.Projects.Add(new Project { Id = 2, Name = "Project 2", Deadline = DateTime.Now.AddDays(20) });

            // time registrations to project id 1
            _context.TimeRegistrations.Add(new TimeRegistration { Id = 1, ProjectId = 1, Description = "Time registration 1", Date = DateTime.Now, DurationInMinutes = 30 });
            _context.TimeRegistrations.Add(new TimeRegistration { Id = 2, ProjectId = 1, Description = "Time registration 2", Date = DateTime.Now, DurationInMinutes = 45 });

            // time registrations to project id 2
            _context.TimeRegistrations.Add(new TimeRegistration { Id = 3, ProjectId = 2, Description = "Time registration 3", Date = DateTime.Now, DurationInMinutes = 60 });
            _context.TimeRegistrations.Add(new TimeRegistration { Id = 4, ProjectId = 2, Description = "Time registration 4", Date = DateTime.Now, DurationInMinutes = 90 });

            _context.SaveChanges();

            _controller = new ProjectsController(_context);
        }

        [TearDown]
        public void TearDown()
        {
            _context.Dispose(); // Cleanup the in-memory database
        }

        [Test]
        public async Task Get_ReturnsAllProjects()
        {
            var result = await _controller.Get(null, null) as OkObjectResult;
            var projects = result.Value as System.Collections.Generic.List<Project>;

            Assert.IsNotNull(result);
            Assert.AreEqual(200, result.StatusCode);
            Assert.AreEqual(2, projects.Count);
        }

        [Test]
        public async Task Post_ValidProject()
        {
            var project = new Project { Name = "New Project", Deadline = DateTime.Now.AddDays(10) };

            var result = await _controller.Post(project);
            Assert.IsNotNull(result);
            var createdAtActionResult = result.Result as CreatedAtActionResult;
            var returnedProject = createdAtActionResult.Value as Project;
            Assert.IsNotNull(returnedProject);
            Assert.AreEqual(project.Name, returnedProject.Name);
        }

        [Test]
        public async Task Post_InvalidProject()
        {
            _controller.ModelState.AddModelError("Name", "Required");
            var project = new Project();
            var result = await _controller.Post(project);
            Assert.IsNotNull(result);

            var badRequestResult = result.Result as BadRequestObjectResult;
            Assert.AreEqual(400, badRequestResult.StatusCode);
        }

        [Test]
        public async Task GetTimeRegistrations()
        {
            var projectId = 1;
            var result = await _controller.GetTimeRegistrations(projectId);
            Assert.IsNotNull(result);

            var okResult = result.Result as OkObjectResult;
            Assert.AreEqual(200, okResult.StatusCode);

            var timeRegistrations = okResult.Value as List<TimeRegistration>; // Assuming TimeRegistration is the type of the elements in the list
            Assert.IsNotNull(timeRegistrations);
            Assert.IsTrue(timeRegistrations.Count > 0);
        }

        [Test]
        public async Task PostTimeRegistration_Valid()
        {
            var projectId = 1;
            var result = await _controller.PostTimeRegistration(
                projectId,
                new TimeRegistration
                {
                    Description = "New time registration",
                    Date = DateTime.Now,
                    DurationInMinutes = 30
                }
            );
            var okResult = result.Result as CreatedAtActionResult;
            Assert.IsNotNull(result.Result);
            Assert.AreEqual(201, okResult.StatusCode);
        }
    }
}