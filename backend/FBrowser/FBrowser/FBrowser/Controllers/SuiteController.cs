using System.Collections.Generic;
using System.Threading.Tasks;
using FBrowser.models;
using FBrowser.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace FBrowser.Controllers
{
    [Route("api/suites/")]
    [ApiController]
    public class SuiteController : ControllerBase
    {
        private readonly FailRepository failRepository;

        public SuiteController(FailRepository failRepository)
        {
            this.failRepository = failRepository;
        }

        [HttpGet]
        public async Task<List<SuiteListEntry>> Get()
        {
            return await failRepository.GetSuites();
        }

        [HttpGet("{id}")]
        public async Task<Suite> GetById(string id)
        {
            return await failRepository.GetSuitesById(id);
        }

        [HttpGet("group/{id}")]

        public async Task<List<SuiteListEntry>> GetByParentId(string id)
        {
            return await failRepository.GetSuitesByParentId(id);
        }
    }
}

