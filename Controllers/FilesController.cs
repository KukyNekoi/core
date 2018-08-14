using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using Microsoft.EntityFrameworkCore;
using think_agro_metrics.Data;
using think_agro_metrics.Models;
using Microsoft.AspNetCore.Authorization;

namespace ThinkAgroMetrics.Controllers
{
    [Produces("application/json")]
    [Route("api/Files")]
    public class FilesController : Controller
    {
        private readonly DataContext _context;
        private IHostingEnvironment _hostingEnvironment;

        public FilesController(DataContext context, IHostingEnvironment hostingEnvironment)
        {
            _context = context;
            _hostingEnvironment = hostingEnvironment;
        }

        // GET: api/Files/ASDKFJ"#L$"L#$J!#"#$JLSDG
        [HttpGet("{link}")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
        public IActionResult Download([FromRoute] string link) 
        {
            string folderName = "Repository";
            string webRootPath = _hostingEnvironment.WebRootPath;
            string newPath = Path.Combine(webRootPath, folderName);
            string fullPath = Path.Combine(newPath, link);

            var locatedFile = System.IO.File.ReadAllBytes(fullPath);
            return new FileContentResult(locatedFile, new
                MediaTypeHeaderValue("application/octet"))
                {
                    FileDownloadName = "descarga.png"
                };
        }

        private bool DocumentExists(long id)
        {
            return _context.Documents.Any(e => e.DocumentID == id);
        }

        // PUT: api/Files/5
        [HttpPut("{id}")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
        public async Task<IActionResult> PutDocument([FromRoute] long id, [FromBody] Document document)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != document.DocumentID)
            {
                return BadRequest();
            }

            _context.Entry(document).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DocumentExists(id))
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
    }

}