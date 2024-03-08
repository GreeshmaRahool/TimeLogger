/* Time registration to track efforts */

using System;
using System.ComponentModel.DataAnnotations;

namespace Timelogger.Entities
{
    public class TimeRegistration
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Project ID is required.")]
        public int ProjectId { get; set; }

        [Required(ErrorMessage = "Date is required.")]
        [CustomValidation(typeof(TimeRegistration), nameof(ValidateDateNotInFuture))]
        public DateTime Date { get; set; }

        [Required(ErrorMessage = "Duration is required.")]
        [Range(30, int.MaxValue, ErrorMessage = "Duration must be at least 30 minutes.")]
        public int DurationInMinutes { get; set; }

        [Required(ErrorMessage = "Description is required.")]
        [StringLength(500, ErrorMessage = "Description cannot be longer than 500 characters.")]
        public string Description { get; set; }

        // Custom validation method for the Date property to ensure it's not in the future
        public static ValidationResult ValidateDateNotInFuture(DateTime date, ValidationContext context)
        {
            if (date > DateTime.Now)
            {
                return new ValidationResult("Date cannot be in the future.");
            }
            return ValidationResult.Success;
        }
    }
}
