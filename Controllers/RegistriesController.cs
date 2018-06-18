using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using think_agro_metrics.Data;
using think_agro_metrics.Models;

namespace think_agro_metrics.Controllers
{
    [Produces("application/json")]
    [Route("api/Registries")]
    public class RegistriesController : Controller
    {
        private readonly DataContext _context;
        private IHostingEnvironment _hostingEnvironment;

        public RegistriesController(DataContext context, IHostingEnvironment hostingEnvironment)
        {
            _context = context;
            _hostingEnvironment = hostingEnvironment;
        }

        // GET: api/Registries
        [HttpGet]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> GetRegistries()
        {
            var registries = await _context.Registries.Include(r => r.Documents).ToListAsync();
            return Ok(registries);
        }

        // GET: api/Registries/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> GetRegistry([FromRoute] long id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var registry = await _context.Registries.SingleAsync(m => m.RegistryID == id);

            if (registry == null)
            {
                return NotFound();
            }
            _context.Registries.Include(x => x.Documents).ToList();
            return Ok(registry);
        }

        // PUT: api/Registries/DefaultRegistry/5
        [HttpPut("DefaultRegistry/{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> PutRegistry([FromRoute] long id, [FromBody] DefaultRegistry registry)
        {   
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != registry.RegistryID)
            {
                return BadRequest();
            }

            _context.Entry(registry).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RegistryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return Ok();
        }


        // PUT: api/Registries/QuantityRegistry/5
        [HttpPut("QuantityRegistry/{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> PutRegistry([FromRoute] long id, [FromBody] QuantityRegistry registry)
        {   
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != registry.RegistryID)
            {
                return BadRequest();
            }

            _context.Entry(registry).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RegistryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok();
        }

        // PUT: api/Registries/PercentRegistry/5
        [HttpPut("PercentRegistry/{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> PutRegistry([FromRoute] long id, [FromBody] PercentRegistry registry)
        {   
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != registry.RegistryID)
            {
                return BadRequest();
            }

            _context.Entry(registry).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RegistryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok();
        }

       // ADD REGISTRY: api/Indicators/5/AddRegistry
        [HttpPost("{indicatorId}/DefaultRegistry")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> DefaultRegistry([FromRoute] long indicatorId,
            [FromBody] DefaultRegistry registry)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Indicator indicator = await _context.Indicators.SingleAsync(i => i.IndicatorID == indicatorId);
            
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

            return Ok();
        }
         private bool IndicatorExists(long id)
        {
            return _context.Indicators.Any(e => e.IndicatorID == id);
        }
        // ADD REGISTRY: api/Indicators/5/AddRegistry
        [HttpPost("{indicatorId}/QuantityRegistry")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> QuantityRegistry([FromRoute] long indicatorId,
            [FromBody] QuantityRegistry registry)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Indicator indicator = await _context.Indicators.SingleAsync(i => i.IndicatorID == indicatorId);

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

            return Ok();
        }

        // ADD REGISTRY: api/Indicators/5/AddRegistry
        [HttpPost("{indicatorId}/PercentRegistry")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> PercentRegistry([FromRoute] long indicatorId,
            [FromBody] PercentRegistry registry)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Indicator indicator = await _context.Indicators.SingleAsync(i => i.IndicatorID == indicatorId);

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

            return Ok();
        }


        // DELETE: api/Registries/Documents/5
        [HttpDelete("Documents/{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> DeleteDocument([FromRoute] long id)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var document = await _context.Documents.SingleAsync(d => d.DocumentID == id );
            
            if(document == null)
            {
                return NotFound();
            }
            
            // Every documents belongs to a Registry, it's not necessary to validate
            var registry = await _context.Registries.SingleAsync(r => r.RegistryID == document.RegistryID);

            registry.Documents.Remove(document); // Delete Document from model

            _context.Documents.Remove(document); // Delete Document from Database

            await _context.SaveChangesAsync();

            return Ok(document);

        }

        // DELETE: api/Registries/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> DeleteRegistry([FromRoute] long id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var registry = await _context.Registries.SingleAsync(m => m.RegistryID == id);

            if (registry == null)
            {
                return NotFound();
            }
            
            // Remove documents from model
            registry.Documents = new List<Document>();

            var docsDB = _context.Documents.Where(d => d.RegistryID == id);
            // Remove documents from database            
            _context.Documents.RemoveRange(docsDB);            

            await _context.SaveChangesAsync();

            _context.Registries.Remove(registry);
            await _context.SaveChangesAsync();

            return Ok(registry); // It works
        }

        private bool RegistryExists(long id)
        {
            return _context.Registries.Any(e => e.RegistryID == id);
        }

        // ADD LinkDocument: api/Registries/5/AddLinkDocument
        [HttpPost("{id}/AddLinkDocument")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> AddLinkDocument([FromRoute] long id,
            [FromBody] Document document)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

			try
			{
				Registry registry = await _context.Registries.SingleAsync(i => i.RegistryID == id);

				registry.Documents.Add(document);

				_context.Entry(registry).State = EntityState.Modified;
				
				await _context.SaveChangesAsync();

				var response = await _context.Documents.SingleOrDefaultAsync(m => m.DocumentID == document.DocumentID);

				return Ok(response);
			}
            catch (DbUpdateConcurrencyException)
            {
                if (!RegistryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
        }

        // ADD FileDocument: api/Registries/5/AddFileDocument
        [HttpPost("{id}/AddFileDocument"), DisableRequestSizeLimit]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> AddFileDocument([FromRoute] long id)
        {
            try
            {
                var file = Request.Form.Files[0];
				var fileDocumentFactory = new FileDocumentFactory(file, _hostingEnvironment);
				
				var document = fileDocumentFactory.CreateDocument();
                Registry registry = _context.Registries.First(i => i.RegistryID == id);
                
                registry.Documents.Add(document);
                _context.Entry(registry).State = EntityState.Modified;
                _context.SaveChanges();

				var response = await _context.Documents.SingleOrDefaultAsync(m => m.DocumentID == document.DocumentID);

				if (response == null)
				{
					return NotFound();
				}

				return Ok(response);
            }
            catch (System.Exception ex)
            {
				throw ex;
            }
        }
                

    }
}