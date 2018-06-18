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
    [Route("api/Indicators")]
    public class IndicatorsController : Controller
    {
        private readonly DataContext _context;

        public IndicatorsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Indicators
        [HttpGet]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> GetIndicators()
        {
            var indicators = await _context.Indicators
                .Include(x => x.Goals)
                .Include(x => x.Registries)                
                .ThenInclude(x => x.Documents).ToListAsync();

            return Ok(indicators);
        }

        // GET: api/Indicators/5
        [HttpGet("{id:long}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> GetIndicator([FromRoute] long id)
        {            
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var indicatorQuery = _context.Indicators.Where(x => x.IndicatorID == id);

            var indicator = await indicatorQuery
                .Include(x => x.Goals)
                .Include(x => x.Registries)
                .ThenInclude(x => x.Documents).SingleAsync();

            if (indicator == null)
            {
                return NotFound();
            }

            return Ok(indicator);
        }

        // GET: api/Indicators/5/2018
        [HttpGet("{id:long}/{year:int}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> GetIndicatorRegitriesByYear([FromRoute] long id, [FromRoute] int year)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Obtain the Registries
            var registries = await _context.Registries
                .Where(r => r.IndicatorID == id && r.Date.Year == year)
                .Include(r => r.Documents)
                .ToArrayAsync();

            var indicator = await _context.Indicators
                .Where(i => i.IndicatorID == id)
                .Include(i => i.Goals)
                .SingleAsync();
            
            // Fails if not found
            if (indicator == null)
            {
                return NotFound();
            }

            indicator.Registries = registries;

            return Ok(indicator);
        }

        // GET: api/Indicators/5/2018/1
        [HttpGet("{id:long}/{year:int}/{month:int}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> GetIndicatorRegitriesByYearMonth([FromRoute] long id, [FromRoute] int year, [FromRoute] int month)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Remember add 1 to month (the month starts in 0 on Angular and in 1 on C#)
            month = month + 1;

            // Obtain the Registries
            var registries = await _context.Registries
                .Where(r => r.IndicatorID == id && r.Date.Year == year && r.Date.Month == month)
                .Include(r => r.Documents)
                .ToArrayAsync();

            var indicator = await _context.Indicators
                .Where(i => i.IndicatorID == id)
                .Include(i => i.Goals)
                .SingleAsync();

            // Fails if not found
            if (indicator == null)
            {
                return NotFound();
            }

            indicator.Registries = registries;

            return Ok(indicator);
        }

        // GET: api/Indicators/Goal/1
        [HttpGet("Goals/{id:long}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> GetIndicatorGoals([FromRoute] long id)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Obtain the Goals
            var goals = await _context.Goals.Where(g => g.IndicatorID == id).ToListAsync();

            // Fails if not found
            if (goals == null) 
            {
                return NotFound();
            }

            double result = 0;
            foreach (Goal goal in goals)
            {
                result += goal.Value;
            }
            // Percent Registry
            var indicator = await _context.Indicators.SingleAsync(i => i.IndicatorID == id);
            if (indicator.RegistriesType == RegistryType.PercentRegistry){
                result /= goals.Count;
            }

            return Ok(result);
        }

        // GET: api/Indicators/Goal/1/2018
        [HttpGet("Goals/{id:long}/{year:int}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> GetIndicatorGoals([FromRoute] long id, [FromRoute] int year)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Obtain the Goals
            var goals = await _context.Goals.Where(g => g.IndicatorID == id && g.Year == year).ToListAsync();

            // Fails if not found
            if (goals == null) 
            {
                return NotFound();
            }

            double result = 0;
            foreach (Goal goal in goals)
            {
                result += goal.Value;
            }
            // Percent Registry
            var indicator = await _context.Indicators.SingleAsync(i => i.IndicatorID == id);
            if (indicator.RegistriesType == RegistryType.PercentRegistry){
                result /= goals.Count;
            }

            return Ok(result);
        }

        // GET: api/Indicators/Goal/1/2018/0 (indicator 1, year 2018, month January)
        [HttpGet("Goals/{id:long}/{year:int}/{month:int}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> GetIndicatorGoals([FromRoute] long id, [FromRoute] int year, [FromRoute] int month)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Remember add 1 to month (the month starts in 0 on Angular and in 1 on C#)
            month = month + 1;

            // Obtain the Goal
            var goal = await _context.Goals.Where(g => g.IndicatorID == id && g.Year == year && g.Month == month).SingleAsync();

            // Fails if not found
            if (goal == null) 
            {
                return NotFound();
            }

            return Ok(goal.Value);
        }

        // GET: api/Indicators/Calculate
        [Route("Calculate")]
        public async Task<IActionResult> CalculateIndicators()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Obtain the Indicators with its Registries
            var indicators = await _context.Indicators
                .Include(i => i.Registries)
                .ToListAsync();

            // If the indicators list is empty, show NotFound
            if (!indicators.Any())
            {
                return NotFound();
            }

            // List of the results of every indicator
            List<double> list = new List<double>();

            // Calculate every indicator
            foreach (Indicator indicator in indicators) {
                indicator.RegistriesType = indicator.RegistriesType; // Assign the IndicatorCalculator according to the Indicator's RegistriesType
                list.Add(indicator.IndicatorCalculator.Calculate(indicator.Registries));
            }
            
            // Return the list with the results
            return Ok(list);
        }
        
        // GET: api/Indicators/Calculate/2018
        [Route("Calculate/{year:int}")]
        public async Task<IActionResult> CalculateIndicators([FromRoute] int year)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Obtain the Indicators with its Registries
            var indicators = await _context.Indicators
                .Include(i => i.Registries)
                .ToListAsync();

            // If the indicators list is empty, show NotFound
            if (!indicators.Any())
            {
                return NotFound();
            }

            // List of the results of every indicator
            List<double> list = new List<double>();

            // Calculate every indicator
            foreach (Indicator indicator in indicators) {
                indicator.RegistriesType = indicator.RegistriesType; // Assign the IndicatorCalculator according to the Indicator's RegistriesType
                list.Add(indicator.IndicatorCalculator.Calculate(indicator.Registries, year));
            }
            
            // Return the list with the results
            return Ok(list);
        }

        // GET: api/Indicators/Calculate/2018/1
        [Route("Calculate/{year:int}/{month:int}")]
        public async Task<IActionResult> CalculateIndicators([FromRoute] int year, [FromRoute] int month)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Obtain the Indicators with its Registries
            var indicators = await _context.Indicators
                .Include(i => i.Registries)
                .ToListAsync();

            // If the indicators list is empty, show NotFound
            if (!indicators.Any())
            {
                return NotFound();
            }

            // Remember add 1 to month (the month starts in 0 on Angular and in 1 on C#)
            month = month + 1;

            // List of the results of every indicator
            List<double> list = new List<double>();

            // Calculate every indicator
            foreach (Indicator indicator in indicators) {
                indicator.RegistriesType = indicator.RegistriesType; // Assign the IndicatorCalculator according to the Indicator's RegistriesType
                list.Add(indicator.IndicatorCalculator.Calculate(indicator.Registries, year, month));
            }
            
            // Return the list with the results
            return Ok(list);
        }

        // GET: api/Indicators/Calculate/5 // Calculate Indicator with ID 5 for all years
        [Route("Calculate/{id:long}")]
        public async Task<ActionResult> CalculateIndicator([FromRoute] long id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Obtain the Indicator with its Registries
            var indicator = await _context.Indicators
                .Where(i => i.IndicatorID == id)
                .Include(i => i.Registries)
                .SingleAsync();

            if (indicator == null)
            {
                return NotFound();
            }

            indicator.RegistriesType = indicator.RegistriesType; // Assign the IndicatorCalculator according to the Indicator's RegistriesType
            var value = indicator.IndicatorCalculator.Calculate(indicator.Registries);

            return Ok(value);
        }

        // GET: api/Indicators/Calculate/5/2018 // Calculate Indicator with ID 5 for a selected year
        [Route("Calculate/{id:long}/{year:int}")]
        public async Task<ActionResult> CalculateIndicatorByYear([FromRoute] long id, [FromRoute] int year)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Obtain the Indicator with its Registries
            var indicator = await _context.Indicators
                .Where(i => i.IndicatorID == id)
                .Include(i => i.Registries)
                .SingleAsync();

            if (indicator == null)
            {
                return NotFound();
            }

            indicator.RegistriesType = indicator.RegistriesType; // Assign the IndicatorCalculator according to the Indicator's RegistriesType
            var value = indicator.IndicatorCalculator.Calculate(indicator.Registries, year);

            return Ok(value);
        }

        // GET: api/Indicators/Calculate/5/2018/0 // Calculate Indicator with ID 5 for a selected year and selected month
        [Route("Calculate/{id:long}/{year:int}/{month:int}")]
        public async Task<ActionResult> CalculateIndicatorByYearMonth([FromRoute] long id, [FromRoute] int year, [FromRoute] int month)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Remember add 1 to month (the month starts in 0 on Angular and in 1 on C#)
            month = month + 1;

            // Obtain the Indicator with its Registries
            var indicator = await _context.Indicators
                .Where(i => i.IndicatorID == id)
                .Include(i => i.Registries)
                .SingleAsync();

            if (indicator == null)
            {
                return NotFound();
            }

            indicator.RegistriesType = indicator.RegistriesType; // Assign the IndicatorCalculator according to the Indicator's RegistriesType
            var value = indicator.IndicatorCalculator.Calculate(indicator.Registries, year, month);

            return Ok(value);
        }

        // PUT: api/Indicators/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> PutIndicator([FromRoute] long id, [FromBody] Indicator indicator)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != indicator.IndicatorID)
            {
                return BadRequest();
            }

            _context.Entry(indicator).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IndicatorExists(id))
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

        // POST: api/Indicators
        [HttpPost]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> PostIndicator([FromBody] Indicator indicator)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Indicators.Add(indicator);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetIndicator", new { id = indicator.IndicatorID }, indicator);
        }

        // DELETE: api/Indicators/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> DeleteIndicator([FromRoute] long id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var indicator = await _context.Indicators.SingleOrDefaultAsync(m => m.IndicatorID == id);
            if (indicator == null)
            {
                return NotFound();
            }

            _context.Indicators.Remove(indicator);
            await _context.SaveChangesAsync();

            return Ok(indicator);
        }

        private bool IndicatorExists(long id)
        {
            return _context.Indicators.Any(e => e.IndicatorID == id);
        }

        // ADD REGISTRY: api/Indicators/5/AddRegistry
        [HttpPost("{indicatorId}/AddRegistry")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> AddRegistry([FromRoute] long indicatorId,
            [FromBody] DefaultRegistry registry)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Indicator indicator = _context.Indicators.First(i => i.IndicatorID == indicatorId);
            //Registry registry = new DefaultRegistry();
            //registry.Name = name;

            indicator.Registries.Add(registry);

            _context.Entry(indicator).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IndicatorExists(indicatorId))
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
    }
}