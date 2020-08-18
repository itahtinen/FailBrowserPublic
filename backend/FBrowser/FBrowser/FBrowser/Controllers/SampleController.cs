using System.Collections.Generic;
using System.Threading.Tasks;
using FBrowser.models;
using FBrowser.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace FBrowser.Controllers
{
    [Route("api/samples")]
    [ApiController]
    public class SampleController : ControllerBase
    {
        private readonly FailRepository failRepository;

        public SampleController(FailRepository failRepository)
        {
            this.failRepository = failRepository;
        }

        [HttpGet("{caseId}", Name = "GetBySampleId")]
        public async Task<List<Sample>> GetBySampleId(string caseId)
        {
            return await failRepository.GetSamplesByCaseId(caseId);
        }
    }
}




