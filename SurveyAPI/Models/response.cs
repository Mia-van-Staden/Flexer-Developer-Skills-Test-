using System.Collections.Generic;

namespace SurveyAPI.Models
{
    public class SurveyResponse
    {
        public string Email { get; set; }
        public string IdNumber { get; set; }
        public Dictionary<int, string> Answers { get; set; }
    }
}