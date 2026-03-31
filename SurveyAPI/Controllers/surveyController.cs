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
            new Question { Id = 1, Text = "What is your annual income?", Type = "number" },
            new Question { Id = 2, Text = "How many years of experience do you have?", Type = "number" },
            new Question { Id = 3, Text = "What is your expected salary range?", Type = "number" },
            new Question { Id = 4, Text = "What is your full name?", Type = "text" },
            new Question { Id = 5, Text = "What is your job title?", Type = "text" },
            new Question { Id = 6, Text = "What company do you work for?", Type = "text" },
            new Question { Id = 7, Text = "What are your career goals?", Type = "text" },
            new Question { Id = 8, Text = "What skills do you want to develop?", Type = "text" },
            new Question { Id = 9, Text = "When did you start your current job?", Type = "date" },
            new Question { Id = 10, Text = "When is your next performance review?", Type = "date" }
        };

        [HttpGet("questions")]
        public IActionResult GetQuestions()
        {
            var random = new Random();
            var shuffled = questions.OrderBy(q => random.Next()).ToList();
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