using Microsoft.AspNetCore.Mvc;
using SurveyAPI.Models;

namespace SurveyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SurveyController : ControllerBase
    {
        private static List<Question> questions = new List<Question>
        {
            new Question { Id = 1, Text = "Enter your age", Type = "number" },
            new Question { Id = 2, Text = "Enter your name", Type = "text" },
            new Question { Id = 3, Text = "Enter your birthdate", Type = "date" },
            new Question { Id = 4, Text = "Enter your city", Type = "text" },
            new Question { Id = 5, Text = "Enter your favorite color", Type = "text" },
            new Question { Id = 6, Text = "Enter your salary", Type = "number" },
            new Question { Id = 7, Text = "Enter your hobby", Type = "text" },
            new Question { Id = 8, Text = "Enter your graduation date", Type = "date" },
            new Question { Id = 9, Text = "Enter your height", Type = "number" },
            new Question { Id = 10, Text = "Enter your profession", Type = "text" }
        };

        [HttpGet("questions")]
        public IActionResult GetQuestions()
        {
            var shuffled = questions.OrderBy(q => Guid.NewGuid()).ToList();
            return Ok(shuffled);
        }

        [HttpPost("submit")]
        public IActionResult Submit([FromBody] SurveyResponse response)
        {
            if (string.IsNullOrEmpty(response.Email) || string.IsNullOrEmpty(response.IdNumber))
                return BadRequest("Email and ID are required");

            var result = new List<string>
            {
                $"Email: {response.Email}",
                $"ID: {response.IdNumber}"
            };

            foreach (var answer in response.Answers)
            {
                result.Add($"Q{answer.Key}: {answer.Value}");
            }

            return Ok(result);
        }
    }
}