using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using think_agro_metrics.Data;
using think_agro_metrics.Models;

namespace think_agro_metrics.Controllers
{
    [Produces("application/json")]
    [Route("api/IndicatorGroups")]
    public class IndicatorGroupsController : Controller
    {
    
        private readonly DataContext _context;

        public IndicatorGroupsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/IndicatorGroups
        [HttpGet]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> GetIndicatorGroups()
        {
            var indicatorGroups = await _context.IndicatorGroups
                .Include(g => g.Indicators)
                .ThenInclude(i => i.Goals)
                .ToListAsync();

            return Ok(indicatorGroups);
        }

        // GET: api/IndicatorGroups/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> GetIndicatorGroup([FromRoute] long id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var indicatorGroup = await _context.IndicatorGroups
                .Where(g => g.IndicatorGroupID == id)
                .Include(g => g.Indicators)
                .ThenInclude(i => i.Goals)
                .SingleAsync();            

            if (indicatorGroup == null)
            {
                return NotFound();
            }

            return Ok(indicatorGroup);
        }

        // GET: api/IndicatorsGroups/Name/5
        [HttpGet("Name/{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> GetIndicatorGroupName([FromRoute] long id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            var indicatorGroup = await _context.IndicatorGroups.SingleAsync(x => x.IndicatorGroupID == id);

            if (indicatorGroup == null)
            {
                return NotFound();
            }

            return Ok(indicatorGroup.Name);
        }

        // PUT: api/IndicatorGroups/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> PutIndicatorGroup([FromRoute] long id, [FromBody] IndicatorGroup indicatorGroup)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != indicatorGroup.IndicatorGroupID)
            {
                return BadRequest();
            }

            _context.Entry(indicatorGroup).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IndicatorGroupExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/IndicatorGroups
        [HttpPost]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> PostIndicatorGroup([FromBody] IndicatorGroup indicatorGroup)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.IndicatorGroups.Add(indicatorGroup);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetIndicatorGroup", new { id = indicatorGroup.IndicatorGroupID }, indicatorGroup);
        }

        // DELETE: api/IndicatorGroups/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> DeleteIndicatorGroup([FromRoute] long id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var indicatorGroup = await _context.IndicatorGroups.SingleOrDefaultAsync(m => m.IndicatorGroupID == id);
            if (indicatorGroup == null)
            {
                return NotFound();
            }

            _context.IndicatorGroups.Remove(indicatorGroup);
            await _context.SaveChangesAsync();

            return Ok(indicatorGroup);
        }

        // GET: api/IndicatorGroups/Calculate/1 (group= 1)
        [Route("Calculate/{id:int}")]
        public async Task<IActionResult> CalculateIndicators([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Load from the DB the IndicatorGroups with its Indicators and Registries
            var indicatorGroup = await _context.IndicatorGroups
                .Where(g => g.IndicatorGroupID == id)
                .Include(g => g.Indicators)
                .ThenInclude(i => i.Registries)
                .SingleAsync();            
            
            // If the specified indicator group doesn't exist, show NotFound
            if (indicatorGroup == null)
            {
                return NotFound();
            }

            // List of the results of every indicator of the group
            List<double> list = new List<double>();

            // Calculate every indicator of the group
            foreach (Indicator indicator in indicatorGroup.Indicators)
            {
                indicator.RegistriesType = indicator.RegistriesType; // Assign the IndicatorCalculator according to the Indicator's RegistriesType
                list.Add(indicator.IndicatorCalculator.Calculate(indicator.Registries));
            }

            // Return the list with the results
            return Ok(list);
        }

        // GET: api/IndicatorGroups/Calculate/1/2018 (group= 1, year= 2018)
        [Route("Calculate/{id:int}/{year:int}")]
        public async Task<IActionResult> CalculateIndicators([FromRoute] int id, [FromRoute] int year)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Load from the DB the IndicatorGroups with its Indicators and Registries
            var indicatorGroup = await _context.IndicatorGroups
                .Where(g => g.IndicatorGroupID == id)
                .Include(g => g.Indicators)
                .ThenInclude(i => i.Registries)
                .SingleAsync();

            // If the specified indicator group doesn't exist, show NotFound
            if (indicatorGroup == null)
            {
                return NotFound();
            }

            // List of the results of every indicator of the group
            List<double> list = new List<double>();

            // Calculate every indicator of the group
            foreach (Indicator indicator in indicatorGroup.Indicators)
            {
                indicator.RegistriesType = indicator.RegistriesType; // Assign the IndicatorCalculator according to the Indicator's RegistriesType
                list.Add(indicator.IndicatorCalculator.Calculate(indicator.Registries, year));
            }

            // Return the list with the results
            return Ok(list);
        }

        // GET: api/IndicatorGroups/Calculate/1/2018/0 (group= 1, year= 2018, month= January)
        [Route("Calculate/{id:int}/{year:int}/{month:int}")]
        public async Task<IActionResult> CalculateIndicators([FromRoute] int id, [FromRoute] int year, [FromRoute] int month)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Remember add 1 to month (the month starts in 0 on Angular and in 1 on C#)
            month = month + 1;

            // Load from the DB the IndicatorGroups with its Indicators and Registries
            var indicatorGroup = await _context.IndicatorGroups
                .Where(g => g.IndicatorGroupID == id)
                .Include(g => g.Indicators)
                .ThenInclude(i => i.Registries)
                .SingleAsync();

            // If the specified indicator group doesn't exist, show NotFound
            if (indicatorGroup == null)
            {
                return NotFound();
            }

            // List of the results of every indicator of the group
            List<double> list = new List<double>();

            // Calculate every indicator of the group
            foreach (Indicator indicator in indicatorGroup.Indicators)
            {
                indicator.RegistriesType = indicator.RegistriesType; // Assign the IndicatorCalculator according to the Indicator's RegistriesType
                list.Add(indicator.IndicatorCalculator.Calculate(indicator.Registries, year, month));
            }

            // Return the list with the results
            return Ok(list);
        }

        // GET: api/IndicatorGroups/Goals/1 (group= 1)
        [Route("Goals/{id:long}")]
        public async Task<IActionResult> GetGoalsIndicators([FromRoute] long id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Load from the DB the Indicators 
            var indicators = await _context.Indicators
                .Where(i => i.IndicatorGroupID == id)
                .Include(i => i.Goals)
                .ToListAsync();            

            // If the specified indicator group don't have indicators, show NotFound
            if (!indicators.Any())
            {
                return NotFound();
            }

            // List of the sums of goals of every indicator of the group
            List<double> list = new List<double>();

            // Sum the goals of every indicator of the group
            foreach (Indicator indicator in indicators)
            {
                double sum = 0;
                foreach (Goal goal in indicator.Goals)
                {
                    sum += goal.Value;
                }
                list.Add(sum);
            }

            // Return the list with the results
            return Ok(list);
        }


        // GET: api/IndicatorGroups/Goals/1/2018 (group = 1, year = 2018)
        [Route("Goals/{id:long}/{year:int}")]
        public async Task<IActionResult> GetGoalsIndicators([FromRoute] int id, [FromRoute] int year)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Load from the DB the Indicators 
            var indicators = await _context.Indicators
                .Where(i => i.IndicatorGroupID == id)
                .Include(i => i.Goals)
                .ToListAsync();

            // If the specified indicator group don't have indicators, show NotFound
            if (!indicators.Any())
            {
                return NotFound();
            }

            // Sum the goals of every indicator of the group of the specified year
            List<double> list = new List<double>();            
            foreach (Indicator indicator in indicators)
            {
                double sum = 0;
                foreach (Goal goal in indicator.Goals)
                {
                    if(goal.Year == year)
                        sum += goal.Value;
                }
                list.Add(sum);
            }

            // Return the list with the results
            return Ok(list);
        }

        // GET: api/IndicatorGroups/Goals/1/2018 (group = 1, year = 2018)
        [Route("Goals/{id:long}/{year:int}/{month:int}")]
        public async Task<IActionResult> GetGoalsIndicators([FromRoute] int id, [FromRoute] int year, [FromRoute] int month)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Remember add 1 to month (the month starts in 0 on Angular and in 1 on C#)
            month = month + 1;

            // Load from the DB the Indicators 
            var indicators = await _context.Indicators
                .Where(i => i.IndicatorGroupID == id)
                .Include(i => i.Goals)
                .ToListAsync();

            // If the specified indicator group don't have indicators, show NotFound
            if (!indicators.Any())
            {
                return NotFound();
            }

            // The goals of every indicator of the group of the specified year and month
            List<double> list = new List<double>();
            foreach (Indicator indicator in indicators)
            {
                foreach (Goal goal in indicator.Goals)
                {
                    if (goal.Year == year && goal.Month == month)
                    {
                        list.Add(goal.Value);
                        continue;
                    }                        
                }                
            }

            // Return the list with the results
            return Ok(list);
        }

        private bool IndicatorGroupExists(long id)
        {
            return _context.IndicatorGroups.Any(e => e.IndicatorGroupID == id);
        }
    }
}