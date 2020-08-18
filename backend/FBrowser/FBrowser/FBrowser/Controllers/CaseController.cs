using System.Collections.Generic;
using System.Threading.Tasks;
using FBrowser.models;
using FBrowser.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace FBrowser.Controllers
{
    [Route("api/cases")]
    [ApiController]
    public class CaseController : ControllerBase
    {
        private readonly FailRepository failRepository;

        public CaseController(FailRepository failRepository)
        {
            this.failRepository = failRepository;
        }

        [HttpGet("{suiteId}", Name = "GetByCaseId")]
        public async Task<List<Case>> GetByCaseId(string suiteId)
        {
            return await failRepository.GetCasesBySuiteId(suiteId);
        }
    }
}

