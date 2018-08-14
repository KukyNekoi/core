using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using think_agro_metrics.Data;
using think_agro_metrics.Models;
using Microsoft.AspNetCore.Authorization;

namespace think_agro_metrics.Controllers
{
    [Produces("application/json")]
    [Route("api/Indicators")]
    public class IndicatorsController : Controller
    {
        private readonly DataContext _context;
        private IHostingEnvironment _hostingEnvironment;

        public IndicatorsController(DataContext context, IHostingEnvironment hostingEnvironment)
        {
            _context = context;
            _hostingEnvironment = hostingEnvironment;
        }

        // GET: api/Indicators
        [HttpGet]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
        public async Task<IActionResult> GetIndicators()
        {
            // I hope nobody needs this
            /*var indicators = await _context.Indicators
                .Include(x => x.Goals)
                .Include(x => x.Registries)                
                .ThenInclude(x => x.Documents).ToListAsync();
            */
            var indicators = await _context.Indicators.ToListAsync();
            return Ok(indicators);
        }

        // GET: api/Indicators/5
        [HttpGet("{id:long}")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
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
                .ThenInclude(x => x.Documents).SingleOrDefaultAsync();

            if (indicator == null)
            {
                return NoContent();
            }

            return Ok(indicator);
        }

        // GET: api/Indicators/5/Year/2018
        [HttpGet("{id:long}/Year/{year:int}")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
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
                .SingleOrDefaultAsync();
            
            // Fails if not found
            if (indicator == null)
            {
                return NoContent();
            }

            indicator.Registries = registries;

            return Ok(indicator);
        }

        // GET: api/Indicators/5/Year/2018/Trimester/1
        [HttpGet("{id:long}/Year/{year:int}/Trimester/{trimester:int}")]
        public async Task<IActionResult> GetIndicatorRegitriesByYearTrimester([FromRoute] long id, [FromRoute] int year, [FromRoute] int trimester)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            // Obtain the Registries
            var registries = await _context.Registries
                .Where(r => r.IndicatorID == id && r.Date.Year == year 
                && (r.Date.Month == (trimester + 1) * 3 || r.Date.Month == (trimester + 1) * 3 - 1 || r.Date.Month == (trimester + 1) * 3 - 2))
                .Include(r => r.Documents)
                .ToArrayAsync();

            var indicator = await _context.Indicators
                .Where(i => i.IndicatorID == id)
                .Include(i => i.Goals)
                .SingleOrDefaultAsync();

            // Fails if not found
            if (indicator == null)
            {
                return NoContent();
            }

            indicator.Registries = registries;

            return Ok(indicator);
        }

        // GET: api/Indicators/5/Year/2018/Month/1
        [HttpGet("{id:long}/Year/{year:int}/Month/{month:int}")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
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
                .SingleOrDefaultAsync();

            // Fails if not found
            if (indicator == null)
            {
                return NoContent();
            }

            indicator.Registries = registries;

            return Ok(indicator);
        }

        // GET: api/Indicators/5/Week/2018/6/9 (9th July 2018)
        [HttpGet("{id:long}/Week/{startWeekYear:int}/{startWeekMonth:int}/{startWeekDay:int}")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
        public async Task<IActionResult> GetIndicatorRegitriesByYearMonth([FromRoute] long id, [FromRoute] int startWeekYear, [FromRoute] int startWeekMonth, [FromRoute] int startWeekDay)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Remember add 1 to month (the month starts in 0 on Angular and in 1 on C#)
            startWeekMonth = startWeekMonth + 1;

            DateTime date = new DateTime(startWeekYear, startWeekMonth, startWeekDay);

            // Obtain the Registries
            var registries = await _context.Registries
                .Where(r => r.IndicatorID == id && 
                    (new DateTime(r.Date.Year, r.Date.Month, r.Date.Day) == date ||
                    new DateTime(r.Date.Year, r.Date.Month, r.Date.Day) == date.AddDays(1) ||
                    new DateTime(r.Date.Year, r.Date.Month, r.Date.Day) == date.AddDays(2) ||
                    new DateTime(r.Date.Year, r.Date.Month, r.Date.Day) == date.AddDays(3) ||
                    new DateTime(r.Date.Year, r.Date.Month, r.Date.Day) == date.AddDays(4) ||
                    new DateTime(r.Date.Year, r.Date.Month, r.Date.Day) == date.AddDays(5) ||
                    new DateTime(r.Date.Year, r.Date.Month, r.Date.Day) == date.AddDays(6)))
                .Include(r => r.Documents)
                .ToArrayAsync();

            var indicator = await _context.Indicators
                .Where(i => i.IndicatorID == id)
                .Include(i => i.Goals)
                .SingleOrDefaultAsync();

            // Fails if not found
            if (indicator == null)
            {
                return NoContent();
            }

            indicator.Registries = registries;

            return Ok(indicator);
        }

        // GET: api/Indicators/1/Goals
        [HttpGet("{id:long}/Goals")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
        public async Task<IActionResult> GetIndicatorGoals([FromRoute] long id)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var indicator = await _context.Indicators.Where(i => i.IndicatorID == id)
                .Include(i => i.Goals).SingleOrDefaultAsync();

            if (indicator == null) {
                return NoContent();
            }

            // Goals of the indicator
            var goals = indicator.Goals;

            // The indicator doesn't have goals (return 0)
            if (goals == null || !goals.Any())
            {
                return Ok(0);
            }

            // Assing indicator calculator
            indicator.RegistriesType = indicator.RegistriesType;

            double result = indicator.IndicatorCalculator.CalculateGoal(goals);

            return Ok(result);
        }

        // GET: api/Indicators/1/Goals/Year/2018
        [HttpGet("{id:long}/Goals/Year/{year:int}")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
        public async Task<IActionResult> GetIndicatorGoals([FromRoute] long id, [FromRoute] int year)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var indicator = await _context.Indicators.Where(i => i.IndicatorID == id)
                .Include(i => i.Goals).SingleOrDefaultAsync();

            if (indicator == null)
            {
                return NoContent();
            }

            // Goals of the indicator
            var goals = indicator.Goals.Where(g => g.Year == year).ToList();

            // The indicator doesn't have goals (return 0)
            if (goals == null || !goals.Any()) 
            {
                return Ok(0);
            }

            // Assing indicator calculator
            indicator.RegistriesType = indicator.RegistriesType;

            double result = indicator.IndicatorCalculator.CalculateGoal(goals);

            return Ok(result);
        }

        // GET: api/Indicators/1/Goals/Year/2018/Trimester/0 (indicator 1, year 2018, trimester January-March)
        [HttpGet("{id:long}/Goals/Year/{year:int}/Trimester/{trimester:int}")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
        public async Task<IActionResult> GetIndicatorGoalsTrimester([FromRoute] long id, [FromRoute] int year, [FromRoute] int trimester)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Obtain the indicator's registries type
            var indicator = await _context.Indicators.Where(i => i.IndicatorID == id)
                .Include(i => i.Goals).SingleOrDefaultAsync();

            if (indicator == null) {
                return NoContent();
            }

            // Obtain the Goals
            // The month of the goals in the DB starts at 0 (equals to Angular side)
            int firstMonthTrimester = (trimester + 1) * 3 - 3;

            var goals = indicator.Goals.Where(g => g.Year == year
            && (g.Month == firstMonthTrimester || g.Month == firstMonthTrimester + 1 || g.Month == firstMonthTrimester + 2)).ToList();

            // Assing indicator calculator
            indicator.RegistriesType = indicator.RegistriesType;

            double result = indicator.IndicatorCalculator.CalculateGoal(goals);

            return Ok(result);
            
        }

        // GET: api/Indicators/1/Goals/Year/2018/Month/0 (indicator 1, year 2018, month January)
        [HttpGet("{id:long}/Goals/Year/{year:int}/Month/{month:int}")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
        public async Task<IActionResult> GetIndicatorGoalsMonth([FromRoute] long id, [FromRoute] int year, [FromRoute] int month)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var indicator = await _context.Indicators.Where(i => i.IndicatorID == id)
                .Include(i => i.Goals).SingleOrDefaultAsync();

            if (indicator == null) {
                return NoContent();
            }

            // Obtain the Goal
            // The month of the goals in the DB starts at 0 (equals to Angular side)
            var goal =  indicator.Goals.Where(g => g.Year == year && g.Month == month).SingleOrDefault();

            // Return 0 if not found
            if (goal == null) 
            {
                return Ok(0);
            }

            return Ok(goal.Value);
        }

        // GET: api/Indicators/1/Goals/Week/2018/6/9 (9th July 2018)
        [HttpGet("{id:long}/Goals/Week/{startWeekYear:int}/{startWeekMonth:int}/{startWeekDay:int}")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
        public async Task<IActionResult> GetIndicatorGoalsWeek([FromRoute] long id, [FromRoute] int startWeekYear, [FromRoute] int startWeekMonth, [FromRoute] int startWeekDay)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var indicator = await _context.Indicators.Where(i => i.IndicatorID == id)
                .Include(i => i.Goals).SingleOrDefaultAsync();

            if (indicator == null)
            {
                return NoContent();
            }

            // Assign indicator calculator
            indicator.RegistriesType = indicator.RegistriesType;

            // Remember the month of the goals in the DB starts at 0          

            double result = indicator.IndicatorCalculator.CalculateGoalWeek(indicator.Goals, startWeekYear, startWeekMonth, startWeekDay);

            return Ok(result);
        }

        // GET: api/Indicators/Calculate
        [Route("Calculate")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
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

            // If the indicators list is empty, show NoContent
            if (!indicators.Any())
            {
                return NoContent();
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
        
        // GET: api/Indicators/Calculate/Year/2018
        [Route("Calculate/Year/{year:int}")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
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

            // If the indicators list is empty, show NoContent
            if (!indicators.Any())
            {
                return NoContent();
            }

            // List of the results of every indicator
            List<double> list = new List<double>();

            // Calculate every indicator
            foreach (Indicator indicator in indicators) {
                indicator.RegistriesType = indicator.RegistriesType; // Assign the IndicatorCalculator according to the Indicator's RegistriesType
                list.Add(indicator.IndicatorCalculator.CalculateYear(indicator.Registries, year));
            }
            
            // Return the list with the results
            return Ok(list);
        }

        // GET: api/Indicators/Calculate/Year/2018/Trimester/1
        [Route("Calculate/Year/{year:int}/Trimester/{trimester:int}")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
        public async Task<IActionResult> CalculateIndicatorsYearTrimester([FromRoute] int year, [FromRoute] int trimester)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Obtain the Indicators with its Registries
            var indicators = await _context.Indicators
                .Include(i => i.Registries)
                .ToListAsync();

            // If the indicators list is empty, show NoContent
            if (!indicators.Any())
            {
                return NoContent();
            }

            // List of the results of every indicator
            List<double> list = new List<double>();

            // Calculate every indicator
            foreach (Indicator indicator in indicators)
            {
                indicator.RegistriesType = indicator.RegistriesType; // Assign the IndicatorCalculator according to the Indicator's RegistriesType
                list.Add(indicator.IndicatorCalculator.CalculateYearTrimester(indicator.Registries, year, trimester));
            }

            // Return the list with the results
            return Ok(list);
        }

        // GET: api/Indicators/Calculate/Year/2018/Month/1
        [Route("Calculate/Year/{year:int}/Month/{month:int}")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
        public async Task<IActionResult> CalculateIndicatorsYearMonth([FromRoute] int year, [FromRoute] int month)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Obtain the Indicators with its Registries
            var indicators = await _context.Indicators
                .Include(i => i.Registries)
                .ToListAsync();

            // If the indicators list is empty, show NoContent
            if (!indicators.Any())
            {
                return NoContent();
            }

            // Remember add 1 to month (the month starts in 0 on Angular and in 1 on C#)
            month = month + 1;

            // List of the results of every indicator
            List<double> list = new List<double>();

            // Calculate every indicator
            foreach (Indicator indicator in indicators) {
                indicator.RegistriesType = indicator.RegistriesType; // Assign the IndicatorCalculator according to the Indicator's RegistriesType
                list.Add(indicator.IndicatorCalculator.CalculateYearMonth(indicator.Registries, year, month));
            }
            
            // Return the list with the results
            return Ok(list);
        }

        // GET: api/Indicators/Calculate/Week/2018/6/9      9 of July of 2018
        [Route("Calculate/Week/{startWeekYear:int}/{startWeekMonth:int}/{startWeekDay:int}")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
        public async Task<IActionResult> CalculateIndicatorsYearWeek([FromRoute] int year, [FromRoute] int startWeekYear, [FromRoute] int startWeekMonth, [FromRoute] int startWeekDay)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Obtain the Indicators with its Registries
            var indicators = await _context.Indicators
                .Include(i => i.Registries)
                .ToListAsync();

            // If the indicators list is empty, show NoContent
            if (!indicators.Any())
            {
                return NoContent();
            }

            // Remember add 1 to month (the month starts in 0 on Angular and in 1 on C#)
            startWeekMonth = startWeekMonth + 1;

            // List of the results of every indicator
            List<double> list = new List<double>();

            // Calculate every indicator
            foreach (Indicator indicator in indicators)
            {
                indicator.RegistriesType = indicator.RegistriesType; // Assign the IndicatorCalculator according to the Indicator's RegistriesType
                list.Add(indicator.IndicatorCalculator.CalculateWeek(indicator.Registries, startWeekYear, startWeekMonth, startWeekDay));
            }

            // Return the list with the results
            return Ok(list);
        }

        // GET: api/Indicators/5/Calculate // Calculate Indicator with ID 5 for all years
        [Route("{id:long}/Calculate")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
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
                .SingleOrDefaultAsync();

            if (indicator == null)
            {
                return NoContent();
            }

            indicator.RegistriesType = indicator.RegistriesType; // Assign the IndicatorCalculator according to the Indicator's RegistriesType
            var value = indicator.IndicatorCalculator.Calculate(indicator.Registries);

            return Ok(value);
        }

        // GET: api/Indicators/5/Calculate/Year/2018 // Calculate Indicator with ID 5 for a selected year
        [Route("{id:long}/Calculate/Year/{year:int}")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
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
                .SingleOrDefaultAsync();

            if (indicator == null)
            {
                return NoContent();
            }

            indicator.RegistriesType = indicator.RegistriesType; // Assign the IndicatorCalculator according to the Indicator's RegistriesType
            var value = indicator.IndicatorCalculator.CalculateYear(indicator.Registries, year);

            return Ok(value);
        }

        // GET: api/Indicators/5/Calculate/Year/2018/Trimester/0 // Calculate Indicator with ID 5 for a selected year and selected trimester
        [Route("{id:long}/Calculate/Year/{year:int}/Trimester/{trimester:int}")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
        public async Task<ActionResult> CalculateIndicatorByYearTrimester([FromRoute] long id, [FromRoute] int year, [FromRoute] int trimester)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Obtain the Indicator with its Registries
            var indicator = await _context.Indicators
                .Where(i => i.IndicatorID == id)
                .Include(i => i.Registries)
                .SingleOrDefaultAsync();

            if (indicator == null)
            {
                return NoContent();
            }

            indicator.RegistriesType = indicator.RegistriesType; // Assign the IndicatorCalculator according to the Indicator's RegistriesType
            var value = indicator.IndicatorCalculator.CalculateYearTrimester(indicator.Registries, year, trimester);

            return Ok(value);
        }

        // GET: api/Indicators/5/Calculate/Year/2018/Month/0 // Calculate Indicator with ID 5 for a selected year and selected month
        [Route("{id:long}/Calculate/Year/{year:int}/Month/{month:int}")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
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
                .SingleOrDefaultAsync();

            if (indicator == null)
            {
                return NoContent();
            }

            indicator.RegistriesType = indicator.RegistriesType; // Assign the IndicatorCalculator according to the Indicator's RegistriesType
            var value = indicator.IndicatorCalculator.CalculateYearMonth(indicator.Registries, year, month);

            return Ok(value);
        }

        // GET: api/Indicators/5/Calculate/Week/2018/6/9 // Calculate Indicator with ID 5 for the week started the 9 of July of 2018
        [Route("{id:long}/Calculate/Week/{startWeekYear:int}/{startWeekMonth:int}/{startWeekDay:int}")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
        public async Task<ActionResult> CalculateIndicatorByYearWeek([FromRoute] long id, [FromRoute] int startWeekYear, [FromRoute] int startWeekMonth, [FromRoute] int startWeekDay)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Remember add 1 to month (the month starts in 0 on Angular and in 1 on C#)
            startWeekMonth = startWeekMonth + 1;

            // Obtain the Indicator with its Registries
            var indicator = await _context.Indicators
                .Where(i => i.IndicatorID == id)
                .Include(i => i.Registries)
                .SingleOrDefaultAsync();

            if (indicator == null)
            {
                return NoContent();
            }

            indicator.RegistriesType = indicator.RegistriesType; // Assign the IndicatorCalculator according to the Indicator's RegistriesType
            var value = indicator.IndicatorCalculator.CalculateWeek(indicator.Registries, startWeekYear, startWeekMonth, startWeekDay);

            return Ok(value);
        }

        // GET: api/Indicators/5/Calculate/Chart // Calculate Indicator with ID 5 for all years by year
        [Route("{id:long}/Calculate/Chart")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
        public async Task<ActionResult> CalculateChartIndicator([FromRoute] long id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Obtain the Indicator with its Registries
            var indicator = await _context.Indicators
                .Where(i => i.IndicatorID == id)
                .Include(i => i.Registries)
                .Include(i => i.Goals)
                .SingleOrDefaultAsync();

            if (indicator == null)
            {
                return NoContent();
            }

            indicator.RegistriesType = indicator.RegistriesType; // Assign the IndicatorCalculator according to the Indicator's RegistriesType
            
            // Calculation
            List<double> values = new List<double>();
            List<Registry> registriesYear;

            int year = 2018;
            int maxYear = year;
            if (indicator.Registries.Any() && indicator.Goals.Any()){
                int maxYearRegistries = indicator.Registries.Max(r => r.Date.Year);
                int maxYearGoals = indicator.Goals.Max(g => g.Year);
                
                if (maxYearRegistries >= maxYearGoals){
                    maxYear = maxYearRegistries;
                }
                else {
                    maxYear = maxYearGoals;
                }
            }
            else if (indicator.Registries.Any()){
                maxYear = indicator.Registries.Max(r => r.Date.Year);
            }
            else if (indicator.Goals.Any()) {
                maxYear = indicator.Goals.Max(g => g.Year);
            }

            // Split the registries by year and calculate
            while (year <= maxYear)
            {
                registriesYear = indicator.Registries.Where(r => r.Date.Year == year).ToList();
                values.Add(indicator.IndicatorCalculator.CalculateYear(registriesYear, year));
                year++;
            }

            // Cumulative sum/average (depends in the type of registries of the indicator)
            double[] result = indicator.IndicatorCalculator.Cumulative(values.ToArray());

            return Ok(result);
        }

        // GET: api/Indicators/5/Calculate/Chart/Year/2018 // Calculate Indicator with ID 5 for a selected year by month
        [Route("{id:long}/Calculate/Chart/Year/{year:int}")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
        public async Task<ActionResult> CalculateChartIndicatorByYear([FromRoute] long id, [FromRoute] int year)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Obtain the Indicator with its Registries
            var indicator = await _context.Indicators
                .Where(i => i.IndicatorID == id)
                .Include(i => i.Registries)
                .SingleOrDefaultAsync();

            if (indicator == null)
            {
                return NoContent();
            }

            indicator.RegistriesType = indicator.RegistriesType; // Assign the IndicatorCalculator according to the Indicator's RegistriesType

            // Calculation
            List<double> values = new List<double>();
            List<Registry> registriesYearMonth;
            int month = 1;

            // Split the registries by month and calculate
            while (month <= 12)
            {
                registriesYearMonth = indicator.Registries.Where(r => r.Date.Year == year && r.Date.Month == month).ToList();
                values.Add(indicator.IndicatorCalculator.CalculateYearMonth(registriesYearMonth, year, month));
                month++;
            }

            // Cumulative sum/average (depends in the type of registries of the indicator)
            double[] result = indicator.IndicatorCalculator.Cumulative(values.ToArray());

            return Ok(result);
        }

        // GET: api/Indicators/5/Calculate/Chart/Year/2018/Trimester/0 // Calculate Indicator with ID 5 for a selected year and selected trimester by month
        [Route("{id:long}/Calculate/Chart/Year/{year:int}/Trimester/{trimester:int}")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
        public async Task<ActionResult> CalculateChartIndicatorByYearTrimester([FromRoute] long id, [FromRoute] int year, [FromRoute] int trimester)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Obtain the Indicator with its Registries
            var indicator = await _context.Indicators
                .Where(i => i.IndicatorID == id)
                .Include(i => i.Registries)
                .SingleOrDefaultAsync();

            if (indicator == null)
            {
                return NoContent();
            }

            indicator.RegistriesType = indicator.RegistriesType; // Assign the IndicatorCalculator according to the Indicator's RegistriesType

            List<double> values = new List<double>();
            List<Registry> registriesYearMonth;
            int initialMonth = (trimester + 1) * 3 - 2;
            int month = initialMonth;

            // Split the registries by month and calculate
            while (month <= initialMonth + 2)
            {
                registriesYearMonth = indicator.Registries.Where(r => r.Date.Year == year && r.Date.Month == month).ToList();
                values.Add(indicator.IndicatorCalculator.CalculateYearMonth(registriesYearMonth, year, month));
                month++;
            }

            // Cumulative sum/average (depends in the type of registries of the indicator)
            double[] result = indicator.IndicatorCalculator.Cumulative(values.ToArray());

            return Ok(result);
        }

        // GET: api/Indicators/5/Calculate/Chart/Year/2018/Month/0 // Calculate Indicator with ID 5 for a selected year and selected month by week, starting in the day specified (from)
        [Route("{id:long}/Calculate/Chart/Year/{year:int}/Month/{month:int}/From/{startWeekYear:int}/{startWeekMonth:int}/{startWeekDay:int}")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
        public async Task<ActionResult> CalculateChartIndicatorByYearMonth([FromRoute] long id, [FromRoute] int year, [FromRoute] int month, [FromRoute] int startWeekYear, [FromRoute] int startWeekMonth, [FromRoute] int startWeekDay)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Remember add 1 to month (the month starts in 0 on Angular and in 1 on C#)
            month++;
            startWeekMonth++;

            // Obtain the Indicator with its Registries
            var indicator = await _context.Indicators
                .Where(i => i.IndicatorID == id)
                .Include(i => i.Registries)
                .SingleOrDefaultAsync();

            if (indicator == null)
            {
                return NoContent();
            }

            // Calculate
            indicator.RegistriesType = indicator.RegistriesType; // Assign the IndicatorCalculator according to the Indicator's RegistriesType

            List<double> values = new List<double>();
            List<Registry> registriesWeek;
            DateTime currentMonday = new DateTime(startWeekYear, startWeekMonth, startWeekDay);


            // Split the registries by weeks and calculate
            while (currentMonday.Month <= month) // Asumes that the first value of currentMonth is at most 1 month less (by example the week of 30/07/2018)
            {
                DateTime nextMonday = currentMonday.AddDays(7);

                registriesWeek = indicator.Registries.Where(r => currentMonday.CompareTo(r.Date) >= 0 && nextMonday.CompareTo(r.Date) < 0).ToList();

                values.Add(indicator.IndicatorCalculator.CalculateWeek(registriesWeek, startWeekYear, startWeekMonth, startWeekDay));

                currentMonday = nextMonday;
            }

            // Cumulative sum/average (depends in the type of registries of the indicator)
            double[] result = indicator.IndicatorCalculator.Cumulative(values.ToArray());

            return Ok(result);
        }

        [Route("{id:long}/Calculate/Chart/Week/{startWeekYear:int}/{startWeekMonth:int}/{startWeekDay:int}")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
        public async Task<ActionResult> CalculateChartIndicatorByYearWeek([FromRoute] long id, [FromRoute] int startWeekYear, [FromRoute] int startWeekMonth, [FromRoute] int startWeekDay)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Remember add 1 to month (the month starts in 0 on Angular and in 1 on C#)
            startWeekMonth = startWeekMonth + 1;

            // Obtain the Indicator with its Registries
            var indicator = await _context.Indicators
                .Where(i => i.IndicatorID == id)
                .Include(i => i.Registries)
                .SingleOrDefaultAsync();

            if (indicator == null)
            {
                return NoContent();
            }

            indicator.RegistriesType = indicator.RegistriesType; // Assign the IndicatorCalculator according to the Indicator's RegistriesType

            List<double> values = new List<double>();
            List<Registry> registriesDay;
            DateTime startDate = new DateTime(startWeekYear, startWeekMonth, startWeekDay);
            DateTime currentDate = startDate;


            // Split the registries by day and calculate
            while (currentDate.CompareTo(startDate.AddDays(7)) < 0)
            {
                registriesDay = indicator.Registries.Where(r => 
                    r.Date.Year == currentDate.Year &&
                    r.Date.Month == currentDate.Month &&
                    r.Date.Day == currentDate.Day)
                    .ToList();

                values.Add(indicator.IndicatorCalculator.Calculate(registriesDay));

                currentDate = currentDate.AddDays(1);
            }

            // Cumulative sum/average (depends in the type of registries of the indicator)
            double[] result = indicator.IndicatorCalculator.Cumulative(values.ToArray());

            return Ok(result);
        }

        // GET: api/Indicators/1/Goals/Chart
        [HttpGet("{id:long}/Goals/Chart")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
        public async Task<IActionResult> GetIndicatorGoalsChart([FromRoute] long id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var indicator = await _context.Indicators.Where(i => i.IndicatorID == id)
                .Include(i => i.Goals).Include(i => i.Registries).SingleOrDefaultAsync();

            if (indicator == null)
            {
                return NoContent();
            }         

            // Assing indicator calculator
            indicator.RegistriesType = indicator.RegistriesType;

            // Calculation
            List<double> values = new List<double>();
            List<Goal> goalsYear;

            int year = 2018;
            int maxYear = year;
            if (indicator.Registries.Any() && indicator.Goals.Any()){
                int maxYearRegistries = indicator.Registries.Max(r => r.Date.Year);
                int maxYearGoals = indicator.Goals.Max(g => g.Year);
                
                if (maxYearRegistries >= maxYearGoals){
                    maxYear = maxYearRegistries;
                }
                else {
                    maxYear = maxYearGoals;
                }
            }
            else if (indicator.Registries.Any()){
                maxYear = indicator.Registries.Max(r => r.Date.Year);
            }
            else if (indicator.Goals.Any()) {
                maxYear = indicator.Goals.Max(g => g.Year);
            }
            else{
                maxYear = year;
            }

            // Split the registries by year and calculate
            while (year <= maxYear)
            {
                goalsYear = indicator.Goals.Where(g => g.Year == year).ToList();
                values.Add(indicator.IndicatorCalculator.CalculateGoal(goalsYear));
                year++;
            }

            // Cumulative sum if the registries aren't of type percent, else returns the maximum value until that moment
            double[] result = indicator.IndicatorCalculator.CumulativeGoals(values.ToArray());

            return Ok(result);
        }

        // GET: api/Indicators/1/Goals/Chart/Year/2018
        [HttpGet("{id:long}/Goals/Chart/Year/{year:int}")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
        public async Task<IActionResult> GetIndicatorGoalsYearChart([FromRoute] long id, [FromRoute] int year)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var indicator = await _context.Indicators.Where(i => i.IndicatorID == id)
                .Include(i => i.Goals).SingleOrDefaultAsync();

            if (indicator == null)
            {
                return NoContent();
            }

            // Goals of the indicator
            var goals = indicator.Goals.Where(g => g.Year == year).ToList();

            // Assing indicator calculator
            indicator.RegistriesType = indicator.RegistriesType;

            // Calculation
            List<double> values = new List<double>();
            List<Goal> goalsMonth;
            // The month of the goals in the DB starts at 0 (equals to Angular side)
            int month = 0;

            // Split the registries by month and calculate
            while (month < 12)
            {
                goalsMonth = indicator.Goals.Where(g => g.Year == year && g.Month == month).ToList();
                values.Add(indicator.IndicatorCalculator.CalculateGoal(goalsMonth));
                month++;
            }

            // Cumulative sum/average (depends in the type of registries of the indicator)
            double[] result = indicator.IndicatorCalculator.CumulativeGoals(values.ToArray());

            return Ok(result);
        }

        // GET: api/Indicators/1/Goals/Chart/Year/2018/Trimester/0 (indicator 1, year 2018, trimester January-March)
        [HttpGet("{id:long}/Goals/Chart/Year/{year:int}/Trimester/{trimester:int}")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
        public async Task<IActionResult> GetIndicatorGoalsChartTrimester([FromRoute] long id, [FromRoute] int year, [FromRoute] int trimester)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Obtain the indicator's registries type
            var indicator = await _context.Indicators.Where(i => i.IndicatorID == id)
                .Include(i => i.Goals).SingleOrDefaultAsync();

            if (indicator == null)
            {
                return NoContent();
            }

            // Obtain the Goals
            // The month of the goals in the DB starts at 0 (equals to Angular side)
            int firstMonthTrimester = (trimester + 1) * 3 - 3;

            var goals = indicator.Goals.Where(g => g.Year == year
            && (g.Month == firstMonthTrimester || g.Month == firstMonthTrimester + 1 || g.Month == firstMonthTrimester + 2)).ToList();

            // Assing indicator calculator
            indicator.RegistriesType = indicator.RegistriesType;

            // Calculation
            List<double> values = new List<double>();
            List<Goal> goalsMonth;
            int month = firstMonthTrimester;

            // Split the registries by month and calculate
            while (month <= firstMonthTrimester + 2)
            {
                goalsMonth = indicator.Goals.Where(g => g.Year == year && g.Month == month).ToList();
                values.Add(indicator.IndicatorCalculator.CalculateGoal(goalsMonth));
                month++;
            }

            // Cumulative sum/average (depends in the type of registries of the indicator)
            double[] result = indicator.IndicatorCalculator.CumulativeGoals(values.ToArray());

            return Ok(result);

        }

        // GET: api/Indicators/1/Goals/Chart/Year/2018/Month/0/From/2018/0/2 (indicator 1, year 2018, month January, from 2/1/2018)
        [HttpGet("{id:long}/Goals/Chart/Year/{year:int}/Month/{month:int}/From/{startWeekYear:int}/{startWeekMonth:int}/{startWeekDay:int}")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
        public async Task<IActionResult> GetIndicatorGoalsChartMonth([FromRoute] long id, [FromRoute] int year, [FromRoute] int month, [FromRoute] int startWeekYear, [FromRoute] int startWeekMonth, [FromRoute] int startWeekDay)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var indicator = await _context.Indicators.Where(i => i.IndicatorID == id)
                .Include(i => i.Goals).SingleOrDefaultAsync();

            if (indicator == null)
            {
                return NoContent();
            }
                                  
            // Calculate
            indicator.RegistriesType = indicator.RegistriesType; // Assign the IndicatorCalculator according to the Indicator's RegistriesType

            // Remember add 1 to month (the month starts in 0 on Angular and in 1 on C#)
            month++;

            List<double> values = new List<double>();
            DateTime currentMonday = new DateTime(startWeekYear, startWeekMonth + 1, startWeekDay);


            // Split the registries by weeks and calculate
            while (currentMonday.Month <= month) // Asumes that the first value of currentMonth is at most 1 month less (by example the week of 30/07/2018)
            {
                values.Add(indicator.IndicatorCalculator.CalculateGoalWeek(indicator.Goals, currentMonday.Year, currentMonday.Month - 1, currentMonday.Day));

                currentMonday = currentMonday.AddDays(7);
            }

            // Cumulative sum/average (depends in the type of registries of the indicator)
            double[] result = indicator.IndicatorCalculator.CumulativeGoals(values.ToArray());

            return Ok(result);
        }

        // GET: api/Indicators/1/Goals/Chart/Week/2018/6/9 (9th July 2018)
        [HttpGet("{id:long}/Goals/Chart/Week/{startWeekYear:int}/{startWeekMonth:int}/{startWeekDay:int}")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
        public async Task<IActionResult> GetIndicatorGoalsChartWeek([FromRoute] long id, [FromRoute] int startWeekYear, [FromRoute] int startWeekMonth, [FromRoute] int startWeekDay)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var indicator = await _context.Indicators.Where(i => i.IndicatorID == id)
                .Include(i => i.Goals).SingleOrDefaultAsync();

            if (indicator == null)
            {
                return NoContent();
            }

            // Assign indicator calculator
            indicator.RegistriesType = indicator.RegistriesType;

            // Remember add 1 to month (the month starts in 0 on Angular and in 1 on C#)
            startWeekMonth++;

            List<double> values = new List<double>();
            Goal goalDay;
            DateTime startDate = new DateTime(startWeekYear, startWeekMonth, startWeekDay);
            DateTime currentDate = startDate;


            // Split the registries by day and calculate
            while (currentDate.CompareTo(startDate.AddDays(7)) < 0)
            {
                // The month of the goals in the BD starts at 0
                goalDay = indicator.Goals.Where(g =>
                    g.Year == currentDate.Year &&
                    g.Month == currentDate.Month - 1)
                    .FirstOrDefault();

                values.Add(indicator.IndicatorCalculator.CalculateGoalDay(goalDay));

                currentDate = currentDate.AddDays(1);
            }

            // Cumulative sum/average (depends in the type of registries of the indicator)
            double[] result = indicator.IndicatorCalculator.CumulativeGoals(values.ToArray());

            return Ok(result);
        }

        // PUT: api/Indicators/5
        [HttpPut("{id}")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección")]
        public async Task<IActionResult> PutIndicator([FromRoute] long id, [FromBody] Indicator indicator)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            List<Indicator> indicators = await _context.Indicators.Where(i => i.Name == indicator.Name && i.IndicatorGroupID == indicator.IndicatorGroupID && i.IndicatorID != id).ToListAsync();

            if(indicators.Any()) {
                return NoContent();
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

            var finalIndicator = await _context.Indicators.SingleOrDefaultAsync(i => i.IndicatorID == id);
            return Ok(finalIndicator);
        }

        // POST: api/Indicators
        [HttpPost]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección")]
        public async Task<IActionResult> PostIndicator([FromBody] Indicator indicator)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            List<Indicator> indicators = _context.Indicators.ToList();

            foreach(Indicator i in indicators)
            {
                if (i.Name.ToUpper().Trim().Equals(indicator.Name.ToUpper().Trim()))
                {
                    return Json(false);
                }
            }

            _context.Indicators.Add(indicator);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetIndicator", new { id = indicator.IndicatorID }, indicator);
        }

        // DELETE: api/Indicators/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección")]
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

            var repository = _hostingEnvironment.WebRootPath + "\\Repository";

            List<Registry> registries = await _context.Registries.Where(r => r.IndicatorID == id).ToListAsync();

            foreach (Registry registry in registries )
            {
                // To delete all documentss asociated to the indicator
                List<Document> docs = await _context.Documents.Where(d => d.RegistryID == registry.RegistryID).ToListAsync();
                foreach (Document doc in docs)
                {
                    if (doc.Extension.Equals(".pdf")) { // If it's a pdf, delete it from the server
                        
                        System.IO.File.Delete(repository + "\\" + doc.Link);
                    }
                    registry.Documents.Remove(doc); // Remove from modal
                    _context.Documents.Remove(doc); // Remove from database
                    await _context.SaveChangesAsync();
                }

                // To delete the registries 
                indicator.Registries.Remove(registry); // Delete from model
                _context.Registries.Remove(registry); // Delete from database
                await _context.SaveChangesAsync();

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
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
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
				
				var createdRegistry = await _context.Registries.SingleOrDefaultAsync(m => m.RegistryID == registry.RegistryID);

				return Ok(createdRegistry);
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
        }

        // GET: api/Indicators/1/GoalsList
        [HttpGet("{id:long}/GoalsList")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
        public async Task<IActionResult> GetIndicatorGoalsList([FromRoute] long id)
        {
            if (!ModelState.IsValid)
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

            return Ok(goals);
        }

        // POST: api/Indicators/1/GoalsList
        [HttpPost("{idIndicator:long}/GoalsList")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección")]
        public async Task<IActionResult> PostGoalsList([FromRoute] long idIndicator, [FromBody] Goal[] goals)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
                       
            _context.Goals.UpdateRange(goals);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetIndicatorGoalsList", new { id = idIndicator }, goals);
        }

        // PUT: api/Indicators/7/Goal
        [HttpPut("{id:long}/Goal/")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección")]
        public async Task<IActionResult> PutIndicatorGoal([FromBody] Goal goal, [FromRoute] long id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != goal.GoalID)
            {
                return BadRequest();
            }

            _context.Entry(goal).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Goals.Any(g => g.GoalID == id))
                {
                    return NotFound();
                }
                else
                {
                    return BadRequest();
                }
            }

            return Ok();
        }

    }
}