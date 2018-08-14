using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace think_agro_metrics.Models
{
    public class Role
    {
        public long RoleID { get; set; } // Role ID for the database 
        public string RoleName { get; set; }
        public string RoleToken { get; set; } // The real RoleID
        public List<Permission> PermissionsRead { get; set; }
        public List<Permission> PermissionsWrite { get; set; }

        public Role()
        {
            this.PermissionsRead = new List<Permission>();
            this.PermissionsWrite = new List<Permission>();
        }

        public void AddRangeRead(Indicator[] indicators)
        {
            foreach (Indicator indicator in indicators)
            {
                Permission permission = new Permission { IndicatorID = indicator.IndicatorID};
                this.PermissionsRead.Add(permission);
            }
        }

        public void AddRangeWrite(Indicator[] indicators)
        {
            foreach (Indicator indicator in indicators)
            {
                Permission permission = new Permission { IndicatorID = indicator.IndicatorID};
                this.PermissionsWrite.Add(permission);
            }
        }

        public void AddRead(Indicator indicator)
        {
            Permission permission = new Permission { IndicatorID = indicator.IndicatorID};
            this.PermissionsRead.Add(permission);
        }

        public void AddWrite(Indicator indicator)
        {
            Permission permission = new Permission { IndicatorID = indicator.IndicatorID};
            this.PermissionsWrite.Add(permission);
        }
    }
}
