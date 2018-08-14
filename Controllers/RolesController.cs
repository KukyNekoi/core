using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using DinkToPdf;
using DinkToPdf.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using think_agro_metrics.Data;
using think_agro_metrics.Models;

namespace think_agro_metrics.Controllers
{
    [Produces("application/json")]
    [Route("api/Roles")]
    public class RolesController : Controller
    {
        private readonly DataContext _context;


        public RolesController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Roles
        [HttpGet]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
        public async Task<IActionResult> GetRoles()
        {
            var roles = await _context.Roles.ToListAsync();
            return Ok(roles);
        }

        // GET: api/Roles/Complete
        [HttpGet("Complete")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
        public async Task<IActionResult> GetRolesComplete()
        {
            var roles = await _context.Roles
                .Include(r => r.PermissionsRead)
                .Include(r => r.PermissionsWrite).ToListAsync();
            return Ok(roles);
        }

        // GET: api/Roles/751381e9-91db-404c-94bb-dbb460551bda
        [HttpGet("{id}")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección,gestor_operaciones,analista_operaciones,ejecutivo_post-venta,encargado_nuevos_negocios,ejecutivo_técnico_de_control_y_seguimiento,extensionista,extensionista_junior,gestor_contenido")]
        public async Task<IActionResult> GetRoleByToken([FromRoute] string id)
        {
            var role = await _context.Roles
                .Where(r => r.RoleToken == id)
                .Include(r => r.PermissionsRead)
                .Include(r => r.PermissionsWrite)
                .SingleOrDefaultAsync();

            if (role ==  null)
            {
                return NotFound();
            }

            return Ok(role);
        }

        // POST api/Roles/751381e9-91db-404c-94bb-dbb460551bda/Permission/Read/true (true to add the permission and false to remove the permission)
        [HttpPost("{id}/Permission/Read/{isRead:bool}")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección")]
        public async Task<IActionResult> AddPermissionRead([FromRoute] string id, bool isRead, [FromBody] Indicator indicator)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var role = await _context.Roles
                .Where(r => r.RoleToken == id)
                .Include(r => r.PermissionsRead)
                .Include(r => r.PermissionsWrite)
                .SingleOrDefaultAsync();

            if (role == null)
            {
                return NotFound();
            }

            if (isRead)
            {
                if (!role.PermissionsRead.Any(p => p.IndicatorID == indicator.IndicatorID))
                {
                    Permission permission = new Permission { IndicatorID = indicator.IndicatorID };
                    role.PermissionsRead.Add(permission);
                    _context.Entry(role).State = EntityState.Modified;
                    _context.Permissions.Add(permission);

                    await _context.SaveChangesAsync();
                }
            }
            else {
                if (role.PermissionsRead.Any(p => p.IndicatorID == indicator.IndicatorID))
                {
                    List<Permission> permissions = role.PermissionsRead.Where(p => p.IndicatorID == indicator.IndicatorID).ToList();
                    role.PermissionsRead.RemoveAll(p => p.IndicatorID == indicator.IndicatorID);
                    _context.Permissions.RemoveRange(permissions);
                    _context.Entry(role).State = EntityState.Modified;

                    await _context.SaveChangesAsync();
                }
            }

            return Ok(role);

        }

        // POST api/Roles/751381e9-91db-404c-94bb-dbb460551bda/Permission/Write/true (true to add the permission and false to remove the permission)
        [HttpPost("{id}/Permission/Write/{isWrite:bool}")]
        [Authorize(Roles = "administrador_indicadores,gerencia_y_dirección")]
        public async Task<IActionResult> AddPermissionWrite([FromRoute] string id, [FromRoute] bool isWrite, [FromBody] Indicator indicator)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var role = await _context.Roles
                .Where(r => r.RoleToken == id)
                .Include(r => r.PermissionsRead)
                .Include(r => r.PermissionsWrite)
                .SingleOrDefaultAsync();

            if (role == null)
            {
                return NotFound();
            }

            if (isWrite)
            {
                if (!role.PermissionsWrite.Any(p => p.IndicatorID == indicator.IndicatorID))
                {
                    Permission permission = new Permission { IndicatorID = indicator.IndicatorID };
                    role.PermissionsWrite.Add(permission);
                    _context.Entry(role).State = EntityState.Modified;
                    _context.Permissions.Add(permission);

                    await _context.SaveChangesAsync();
                }
            }
            else {
                if (role.PermissionsWrite.Any(p => p.IndicatorID == indicator.IndicatorID))
                {
                    List<Permission> permissions = role.PermissionsWrite.Where(p => p.IndicatorID == indicator.IndicatorID).ToList();
                    role.PermissionsWrite.RemoveAll(p => p.IndicatorID == indicator.IndicatorID);
                    _context.Permissions.RemoveRange(permissions);
                    _context.Entry(role).State = EntityState.Modified;

                    await _context.SaveChangesAsync();
                }
            }

            return Ok(role);
        }
    }
}
