using System;
using System.ComponentModel.DataAnnotations;

namespace Timelogger.Entities
{
	public class Project
	{
		public int Id { get; set; }

		[Required(ErrorMessage = "Project name is required.")]
		[StringLength(100, ErrorMessage = "Project name cannot be longer than 100 characters.")]
		public string Name { get; set; }

		[Required(ErrorMessage = "Deadline is required")]
		[CustomValidation(typeof(Project), "ValidateDeadline")]
		public DateTime Deadline { get; set; }
		public bool IsComplete { get => Deadline <= DateTime.Today; }

		// Custom validation method for the Deadline property
		public static ValidationResult ValidateDeadline(DateTime deadline, ValidationContext context)
		{
			if (deadline < DateTime.Today)
			{
				return new ValidationResult("Deadline cannot be in the past.");
			}
			return ValidationResult.Success;
		}
	}
}
