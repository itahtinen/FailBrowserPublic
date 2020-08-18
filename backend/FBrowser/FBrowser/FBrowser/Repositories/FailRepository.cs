using FBrowser.models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FBrowser.Repositories

{
    public class SuiteListEntry
    {
        public string ParentId { get; set; }

        public Suite[] Suites { get; set; }
    }

    public class FailRepository
    {

        private readonly FailContext failContext;

        public FailRepository(FailContext failContext)
        {
            this.failContext = failContext;
        }

        public async Task<List<SuiteListEntry>> GetSuites()
        {
            var suiteList = await failContext.Suites.ToListAsync();
            return suiteList.GroupBy(s => s.parentid).Select(g => new SuiteListEntry { ParentId = g.Key, Suites = g.ToArray() }).ToList();
        }

        public async Task<Suite> GetSuitesById(string id)
        {
            return await failContext.Suites.FirstOrDefaultAsync(g => g.id == id);
        }

        public async Task<List<SuiteListEntry>> GetSuitesByParentId(string parentId)
        {
            var suiteGroup =  await failContext.Suites
                .Where(s => s.id == parentId || s.parentid == parentId)
                .ToArrayAsync();

            return suiteGroup.GroupBy(s => s.parentid).Select(g => new SuiteListEntry { ParentId = g.Key, Suites = g.ToArray() }).ToList();
        }

        public async Task<List<Case>> GetCasesBySuiteId(string suiteId)
        {
            return await failContext.Cases.Where(g => g.suiteid == suiteId).ToListAsync();
        }

        public async Task<List<Sample>> GetSamplesByCaseId(string caseId)
        {
            return await failContext.Samples
                .Where(g => g.caseid == caseId)
                .Select(s => new Sample
                {
                    id = s.id,
                    name = s.name,
                    status = s.status,
                    log = s.log
                })
                .ToListAsync();
        }
    }
}
