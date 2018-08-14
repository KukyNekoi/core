using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using think_agro_metrics.Models;

namespace think_agro_metrics.Data
{
    public static class DbInitializer
    {

        private static Role[] roles;

        public static void Initialize(DataContext context)
        {
            context.Database.EnsureCreated();

            // Look for any indicator group.
            if (context.IndicatorGroups.Any())
            {
                return;   // DB has been seeded
            }

            DbInitializer.roles = CreateRoles(context);

            var IndicatorGroup1 = new IndicatorGroup {Name = "Estimación de aumento de inversiones de las empresas"};
            context.IndicatorGroups.Add(IndicatorGroup1);
            context.SaveChanges();
            CreateIndicatorsGroup1(context, IndicatorGroup1.IndicatorGroupID);
            
            var IndicatorGroup2 = new IndicatorGroup {Name = "Estimación de la creación de nuevos empleos a partir de la prestación de servicios"};
            context.IndicatorGroups.Add(IndicatorGroup2);
            context.SaveChanges();
            CreateIndicatorsGroup2(context, IndicatorGroup2.IndicatorGroupID);

            var IndicatorGroup3 = new IndicatorGroup {Name = "Estimación de la disminución de costos en empresas"};
            context.IndicatorGroups.Add(IndicatorGroup3);
            context.SaveChanges();
            CreateIndicatorsGroup3(context, IndicatorGroup3.IndicatorGroupID);

            var IndicatorGroup4 = new IndicatorGroup {Name = "Estimación del aumento de ventas en empresas"};
            context.IndicatorGroups.Add(IndicatorGroup4);
            context.SaveChanges();
            CreateIndicatorsGroup4(context, IndicatorGroup4.IndicatorGroupID);

            var IndicatorGroup5 = new IndicatorGroup {Name = "Estimación del aumento de productividad en empresas"};
            context.IndicatorGroups.Add(IndicatorGroup5);
            context.SaveChanges();
            CreateIndicatorsGroup5(context, IndicatorGroup5.IndicatorGroupID);

            var IndicatorGroup6 = new IndicatorGroup {Name = "Satisfacción de empresas por servicios prestados"};
            context.IndicatorGroups.Add(IndicatorGroup6);
            context.SaveChanges();
            CreateIndicatorsGroup6(context, IndicatorGroup6.IndicatorGroupID);

            var IndicatorGroup7 = new IndicatorGroup {Name = "Sustentabilidad del CET"};
            context.IndicatorGroups.Add(IndicatorGroup7);
            context.SaveChanges();
            CreateIndicatorsGroup7(context, IndicatorGroup7.IndicatorGroupID);

            var IndicatorGroup8 = new IndicatorGroup {Name = "Mejora de procesos internos CET"};
            context.IndicatorGroups.Add(IndicatorGroup8);
            context.SaveChanges();
            CreateIndicatorsGroup8(context, IndicatorGroup8.IndicatorGroupID);

            var IndicatorGroup9 = new IndicatorGroup {Name = "Prestación de servicios de extensionismo tecnológico a empresas"};
            context.IndicatorGroups.Add(IndicatorGroup9);
            context.SaveChanges();
            CreateIndicatorsGroup9(context, IndicatorGroup9.IndicatorGroupID);

            var IndicatorGroup10 = new IndicatorGroup {Name = "Vinculación con entidades nacionales e internacionales"};
            context.IndicatorGroups.Add(IndicatorGroup10);
            context.SaveChanges();
            CreateIndicatorsGroup10(context, IndicatorGroup10.IndicatorGroupID);

            var IndicatorGroup11 = new IndicatorGroup {Name = "Vinculación con Académicos y Estudiantes"};
            context.IndicatorGroups.Add(IndicatorGroup11);
            context.SaveChanges();
            CreateIndicatorsGroup11(context, IndicatorGroup11.IndicatorGroupID);

            var IndicatorGroup12 = new IndicatorGroup {Name = "Cumplimiento del presupuesto del CET"};
            context.IndicatorGroups.Add(IndicatorGroup12);
            context.SaveChanges();
            CreateIndicatorsGroup12(context, IndicatorGroup12.IndicatorGroupID);

            var IndicatorGroup13 = new IndicatorGroup {Name = "Formación de los profesionales extensionistas e integrantes del equipo de gestión en ámbitos relacionados al Extensionismo tecnológico"};
            context.IndicatorGroups.Add(IndicatorGroup13);
            context.SaveChanges();
            CreateIndicatorsGroup13(context, IndicatorGroup13.IndicatorGroupID);
        }

        // Indicators

        private static Indicator[] CreateIndicatorsGroup1(DataContext context, long groupID)
        {
            var indicator1a = new Indicator { Name = "Cantidad de empresas con aumento de inversión", RegistriesName = "", RegistriesType = RegistryType.DefaultRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre de la empresa que ha tenido un aumento en la inversión.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator1a);
            context.SaveChanges();

            var indicator1b = new Indicator { Name = "Porcentaje de aumento de inversión de los clientes asesorados", RegistriesName = "% de aumento de inversión", RegistriesType = RegistryType.PercentRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre de la empresa que ha tenido un aumento en la inversión. En el valor de registro se debe especificar el porcentaje de aumento.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator1b);
            context.SaveChanges();

            var indicators1 = new Indicator[]{
                indicator1a, indicator1b};

            roles[0].AddRangeRead(indicators1); // admin
            roles[0].AddRangeWrite(indicators1); // admin
            context.SaveChanges();

            roles[1].AddRangeRead(indicators1); // gerencia y direccion
            roles[1].AddRangeWrite(indicators1); // gerencia y direccion
            context.SaveChanges();

            roles[2].AddRangeRead(indicators1); // Encargado de OPS
            roles[2].AddRangeWrite(indicators1); // Encargado de OPS
            context.SaveChanges();

            roles[3].AddRangeRead(indicators1); // Analista de OPS
            context.SaveChanges();

            roles[4].AddRangeRead(indicators1); // Ejecutivo Postventa
            roles[4].AddRangeWrite(indicators1); // Ejecutivo Postventa
            context.SaveChanges();

            return indicators1;
        }
        private static Indicator[] CreateIndicatorsGroup2(DataContext context, long groupID)
        {
            var indicator2a = new Indicator { Name = "Cantidad empresas asesoradas con nuevos empleos formales", RegistriesName = "", RegistriesType = RegistryType.DefaultRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre de la empresa que ha tenido nuevos empleos formales.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator2a);
            context.SaveChanges();

            var indicator2b = new Indicator { Name = "Porcentaje aumento empleos de los clientes asesorados/as que declararon nuevos empleos", RegistriesName = "% de aumento de empleos", RegistriesType = RegistryType.PercentRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre de la empresa que ha tenido nuevos empleos formales. En el valor de registro se debe especificar el porcentaje de aumento de empleos.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator2b);
            context.SaveChanges();

            var indicators2 = new Indicator[]{
                indicator2a, indicator2b};

            roles[0].AddRangeRead(indicators2); // admin
            roles[0].AddRangeWrite(indicators2); // admin
            context.SaveChanges();

            roles[1].AddRangeRead(indicators2); // gerencia y direccion
            roles[1].AddRangeWrite(indicators2); // gerencia y direccion
            context.SaveChanges();

            roles[2].AddRangeRead(indicators2); // Encargado de OPS
            roles[2].AddRangeWrite(indicators2); // Encargado de OPS
            context.SaveChanges();

            roles[3].AddRangeRead(indicators2); // Analista de OPS
            context.SaveChanges();

            roles[4].AddRangeRead(indicators2); // Ejecutivo Postventa
            roles[4].AddRangeWrite(indicators2); // Ejecutivo Postventa
            context.SaveChanges();

            return indicators2;
        }
        private static Indicator[] CreateIndicatorsGroup3(DataContext context, long groupID)
        {
            var indicator3a = new Indicator { Name = "Cantidad empresas con disminución de costos", RegistriesName = "", RegistriesType = RegistryType.DefaultRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre de la empresa que ha tenido disminución de costos.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator3a);
            context.SaveChanges();

            var indicator3b = new Indicator { Name = "Porcentaje de disminución de costos de los clientes asesorados/as", RegistriesName = "% de disminución de costos", RegistriesType = RegistryType.PercentRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre de la empresa que ha tenido disminución de costos. En el valor de registro se debe especificar el porcentaje de disminución de los costos.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator3b);
            context.SaveChanges();

            var indicators3 = new Indicator[]{
                indicator3a, indicator3b};

            roles[0].AddRangeRead(indicators3); // admin
            roles[0].AddRangeWrite(indicators3); // admin
            context.SaveChanges();

            roles[1].AddRangeRead(indicators3); // gerencia y direccion
            roles[1].AddRangeWrite(indicators3); // gerencia y direccion
            context.SaveChanges();

            roles[2].AddRangeRead(indicators3); // Encargado de OPS
            roles[2].AddRangeWrite(indicators3); // Encargado de OPS
            context.SaveChanges();

            roles[3].AddRangeRead(indicators3); // Analista de OPS
            context.SaveChanges();

            roles[4].AddRangeRead(indicators3); // Ejecutivo Postventa
            roles[4].AddRangeWrite(indicators3); // Ejecutivo Postventa
            context.SaveChanges();

            return indicators3;
        }
        private static Indicator[] CreateIndicatorsGroup4(DataContext context, long groupID)
        {
            var indicator4a = new Indicator { Name = "Cantidad empresas con aumento de ventas", RegistriesName = "", RegistriesType = RegistryType.DefaultRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre de la empresa que ha tenido aumento de ventas.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator4a);
            context.SaveChanges();

            var indicator4b = new Indicator { Name = "Porcentaje de aumento de ventas de los clientes asesorados/as que declararon ventas", RegistriesName = "% de aumento de ventas", RegistriesType = RegistryType.PercentRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre de la empresa que ha tenido aumento de ventas. En el valor de registro se debe especificar el porcentaje de aumento de las ventas.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator4b);
            context.SaveChanges();

            var indicators4 = new Indicator[]{
                indicator4a, indicator4b};

            roles[0].AddRangeRead(indicators4); // admin
            roles[0].AddRangeWrite(indicators4); // admin
            context.SaveChanges();

            roles[1].AddRangeRead(indicators4); // gerencia y direccion
            roles[1].AddRangeWrite(indicators4); // gerencia y direccion
            context.SaveChanges();

            roles[2].AddRangeRead(indicators4); // Encargado de OPS
            roles[2].AddRangeWrite(indicators4); // Encargado de OPS
            context.SaveChanges();

            roles[3].AddRangeRead(indicators4); // Analista de OPS
            context.SaveChanges();

            roles[4].AddRangeRead(indicators4); // Ejecutivo Postventa
            roles[4].AddRangeWrite(indicators4); // Ejecutivo Postventa
            context.SaveChanges();

            return indicators4;
        }
        private static Indicator[] CreateIndicatorsGroup5(DataContext context, long groupID)
        {
            var indicator5a = new Indicator { Name = "Cantidad de empresas con aumentos de productividad", RegistriesName = "", RegistriesType = RegistryType.DefaultRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre de la empresa que ha tenido aumento en la productividad.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator5a);
            context.SaveChanges();

            var indicator5b = new Indicator { Name = "Porcentaje de aumento de productividad de los clientes asesorados/as", RegistriesName = "% de aumento de productividad", RegistriesType = RegistryType.PercentRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre de la empresa que ha tenido aumento de productividad. En el valor de registro se debe especificar el porcentaje de aumento de la productividad.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator5b);
            context.SaveChanges();

            var indicators5 = new Indicator[]{
                indicator5a, indicator5b};

            roles[0].AddRangeRead(indicators5); // admin
            roles[0].AddRangeWrite(indicators5); // admin
            context.SaveChanges();

            roles[1].AddRangeRead(indicators5); // gerencia y direccion
            roles[1].AddRangeWrite(indicators5); // gerencia y direccion
            context.SaveChanges();

            roles[2].AddRangeRead(indicators5); // Encargado de OPS
            roles[2].AddRangeWrite(indicators5); // Encargado de OPS
            context.SaveChanges();

            roles[3].AddRangeRead(indicators5); // Analista de OPS
            context.SaveChanges();

            roles[4].AddRangeRead(indicators5); // Ejecutivo Postventa
            roles[4].AddRangeWrite(indicators5); // Ejecutivo Postventa
            context.SaveChanges();

            return indicators5;
        }
        private static Indicator[] CreateIndicatorsGroup6(DataContext context, long groupID)
        {
            var indicator6a = new Indicator { Name = "Porcentaje de satisfacción de empresas frutícolas", RegistriesName = "% de satisfacción", RegistriesType = RegistryType.PercentRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre de la empresa frutícola. En el valor de registro se debe especificar el porcentaje de satisfacción de la empresa.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator6a);
            context.SaveChanges();

            var indicator6b = new Indicator { Name = "Porcentaje de satisfacción en diagnósticos", RegistriesName = "% de satisfacción", RegistriesType = RegistryType.PercentRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre de la empresa diagnosticada. En el valor de registro se debe especificar el porcentaje de satisfacción de la empresa en el diagnóstico.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator6b);
            context.SaveChanges();

            var indicator6c = new Indicator { Name = "Porcentaje de satisfacción de empresas agroindustriales", RegistriesName = "% de satisfacción", RegistriesType = RegistryType.PercentRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre de la empresa agroindustrial. En el valor de registro se debe especificar el porcentaje de satisfacción de la empresa.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator6c);
            context.SaveChanges();

            var indicators6 = new Indicator[]{
                indicator6a, indicator6b, indicator6c};

            roles[0].AddRangeRead(indicators6); // admin
            roles[0].AddRangeWrite(indicators6); // admin
            context.SaveChanges();

            roles[1].AddRangeRead(indicators6); // gerencia y direccion
            roles[1].AddRangeWrite(indicators6); // gerencia y direccion
            context.SaveChanges();

            roles[2].AddRangeRead(indicators6); // Encargado de OPS
            roles[2].AddRangeWrite(indicators6); // Encargado de OPS
            context.SaveChanges();

            roles[3].AddRangeRead(indicators6); // Analista de OPS
            context.SaveChanges();

            roles[4].AddRangeRead(indicators6); // Ejecutivo Postventa
            roles[4].AddRangeWrite(indicators6); // Ejecutivo Postventa
            context.SaveChanges();

            return indicators6;
        }
        private static Indicator[] CreateIndicatorsGroup7(DataContext context, long groupID)
        {
            var indicator7a = new Indicator{Name = "Cantidad de proyectos apalancados", RegistriesName = "", RegistriesType = RegistryType.DefaultRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre del proyecto apalancado.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator7a);
            context.SaveChanges();

            var indicator7b = new Indicator{Name = "Recursos directos apalancados", RegistriesName = "recursos apalancados ($)", RegistriesType = RegistryType.QuantityRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre del proyecto apalancado. En el valor de registro se debe especificar el monto de recursos apalancados de manera directa.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator7b);
            context.SaveChanges();

            var indicator7c = new Indicator{Name = "Recursos indirectos apalancados", RegistriesName = "recursos apalancados ($)", RegistriesType = RegistryType.QuantityRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre del proyecto apalancado. En el valor de registro se debe especificar el monto de recursos apalancados de manera indirecta.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator7c);
            context.SaveChanges();
            
            var indicator7d = new Indicator{Name = "Porcentaje subsidio por empresa.", RegistriesName = "% de subsidio", RegistriesType = RegistryType.PercentRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre de la empresa. En el valor de registro se debe especificar el porcentaje de subsidio de dicha empresa.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator7d);
            context.SaveChanges();

            var indicator7e = new Indicator{Name = "Ingresos por servicios Agroindustriales", RegistriesName = "de ingreso ($)", RegistriesType = RegistryType.QuantityRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre del servicio agroindustrial. En el valor de registro se debe especificar el monto de los ingresos por conceptos de ese servicio.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator7e);
            context.SaveChanges();

            var indicator7f = new Indicator{Name = "Ingresos por servicios Frutícolas", RegistriesName = "de ingreso ($)", RegistriesType = RegistryType.QuantityRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre del servicio frutícola. En el valor de registro se debe especificar el monto de los ingresos por conceptos de ese servicio.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator7f);
            context.SaveChanges();

            var indicator7g = new Indicator{Name = "Ingresos por membresías", RegistriesName = "de ingreso ($)", RegistriesType = RegistryType.QuantityRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre o denominación de la membresía. En el valor de registro se debe especificar el mondo de ingresos por concepto de esta membresía.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator7g);
            context.SaveChanges();

            var indicator7h = new Indicator{Name = "Cantidad de membresías", RegistriesName = "", RegistriesType = RegistryType.DefaultRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre o denominación de la membresía.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator7h);
            context.SaveChanges();

            var indicator7i = new Indicator{Name = "Ingresos por capacitaciones", RegistriesName = "de ingreso ($)", RegistriesType = RegistryType.QuantityRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre de la capacitación. En el valor de registro se debe especificar el monto de ingresos por conceptos de esa capacitación", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator7i);
            context.SaveChanges();

            var indicator7j = new Indicator{Name = "Otros ingresos", RegistriesName = "de ingreso ($)", RegistriesType = RegistryType.QuantityRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre de la actividad que generó ingresos. En el valor de registro se debe especificar el monto de ingresos por concepto de esa actividad.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator7j);
            context.SaveChanges();

            var indicators7 = new Indicator[]{
                indicator7a, indicator7b, indicator7c, indicator7d, indicator7e, indicator7f, indicator7g, indicator7h, indicator7i, indicator7j};

            roles[0].AddRangeRead(indicators7); // admin
            roles[0].AddRangeWrite(indicators7); // admin
            context.SaveChanges();

            roles[1].AddRangeRead(indicators7); // gerencia y direccion
            roles[1].AddRangeWrite(indicators7); // gerencia y direccion
            context.SaveChanges();

            roles[2].AddRangeRead(indicators7); // Encargado de OPS
            roles[2].AddRangeWrite(indicators7); // Encargado de OPS
            context.SaveChanges();

            roles[3].AddRangeRead(indicators7); // Analista de OPS
            context.SaveChanges();

            return indicators7;
        }
        private static Indicator[] CreateIndicatorsGroup8(DataContext context, long groupID)
        {
            var indicator8a = new Indicator { Name = "Cantidad de procedimientos estandarizados", RegistriesName = "", RegistriesType = RegistryType.DefaultRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre del procedimiento estandarizado.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator8a);
            context.SaveChanges();

            var indicator8b = new Indicator { Name = "Cantidad de mejoras a los procesos realizados", RegistriesName = "", RegistriesType = RegistryType.DefaultRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre del proceso de mejora.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator8b);
            context.SaveChanges();

            var indicator8c = new Indicator { Name = "Porcentaje de satisfacción del equipo extensionista en procesos internos", RegistriesName = "% de satisfacción", RegistriesType = RegistryType.PercentRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre del extensionista. En el valor de registro se debe especificar el porcentaje de satisfacción de dicho extensionista.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator8c);
            context.SaveChanges();

            var indicators8 = new Indicator[]{
                indicator8a, indicator8b, indicator8c};

            roles[0].AddRangeRead(indicators8); // admin
            roles[0].AddRangeWrite(indicators8); // admin
            context.SaveChanges();

            roles[1].AddRangeRead(indicators8); // gerencia y direccion
            roles[1].AddRangeWrite(indicators8); // gerencia y direccion
            context.SaveChanges();

            roles[2].AddRangeRead(indicators8); // Encargado de OPS
            roles[2].AddRangeWrite(indicators8); // Encargado de OPS
            context.SaveChanges();

            roles[3].AddRangeRead(indicators8); // Analista de OPS
            context.SaveChanges();

            return indicators8;
        }
        private static Indicator[] CreateIndicatorsGroup9(DataContext context, long groupID)
        {
            var indicator9a = new Indicator { Name = "Cantidad diagnósticos realizados a Pymes", RegistriesName = "", RegistriesType = RegistryType.ExternalRegistry, RegistriesDescription = "", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator9a);
            context.SaveChanges();

            var indicator9c = new Indicator { Name = "Cantidad de diagnósticos entregados en plazo estimado", RegistriesName = "", RegistriesType = RegistryType.DefaultRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre del diagnóstico entregado en el plazo estimado.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator9c);
            context.SaveChanges();

            var indicator9d = new Indicator { Name = "Cantidad de diagnósticos entregados fuera de plazo estimado", RegistriesName = "", RegistriesType = RegistryType.DefaultRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre del diagnóstico entregado fuera del plazo estimado.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator9d);
            context.SaveChanges();

            var indicator9e = new Indicator { Name = "Cantidad de propuestas de mejora en plazo estimado", RegistriesName = "", RegistriesType = RegistryType.DefaultRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre de la propuesta entregada en el plazo estimado.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator9e);
            context.SaveChanges();

            var indicator9f = new Indicator { Name = "Cantidad de propuestas de mejora fuera de plazo estimado", RegistriesName = "", RegistriesType = RegistryType.DefaultRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre de la propuesta entregada fuerza del plazo estimado.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator9f);
            context.SaveChanges();

            var indicator9g = new Indicator { Name = "Cantidad de empresas intervenidas", RegistriesName = "", RegistriesType = RegistryType.DefaultRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre de la empresa intervenida.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator9g);
            context.SaveChanges();

            var indicator9h = new Indicator { Name = "Cantidad de empresas asesoradas individualmente o en proceso de asesoría.", RegistriesName = "", RegistriesType = RegistryType.DefaultRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre de la empresa asesorada o en proceso de asesoría.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator9h);
            context.SaveChanges();

            /*
            var indicator9i = new Indicator { Name = "Porcentaje de intervenciones efectivamente realizadas", RegistriesName = "Registro", RegistriesType = RegistryType.PercentRegistry, RegistriesDescription = "9i", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator9i);
            context.SaveChanges();

            var indicator9j = new Indicator { Name = "Cobertura territorial", RegistriesName = "Registro", RegistriesType = RegistryType.QuantityRegistry, RegistriesDescription = "9j", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator9j);
            context.SaveChanges();
            */

            var indicator9k = new Indicator { Name = "Cantidad de visitas a empresas", RegistriesName = "", RegistriesType = RegistryType.DefaultRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre de la empresa visitada.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator9k);
            context.SaveChanges();

            var indicator9l = new Indicator { Name = "Cantidad de servicios que empresas demandan", RegistriesName = "servicios demandados", RegistriesType = RegistryType.QuantityRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre de la empresa que demanda servicios. En el valor de registro se debe especificar la cantidad de servicios demandados por esa empresa.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator9l);
            context.SaveChanges();

            var indicator9m = new Indicator { Name = "Cobertura provincia de Curico", RegistriesName = "", RegistriesType = RegistryType.DefaultRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre de la empresa ubicada en esta provincia.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator9m);
            context.SaveChanges();

            var indicator9n = new Indicator { Name = "Cobertura provincia de Talca", RegistriesName = "", RegistriesType = RegistryType.DefaultRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre de la empresa ubicada en esta provincia.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator9n);
            context.SaveChanges();

            var indicator9o = new Indicator { Name = "Cobertura provincia de Cauquenes", RegistriesName = "", RegistriesType = RegistryType.DefaultRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre de la empresa ubicada en esta provincia", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator9o);
            context.SaveChanges();

            var indicator9p = new Indicator { Name = "Cobertura provincia de Linares", RegistriesName = "", RegistriesType = RegistryType.DefaultRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre de la empresa ubicada en esta provincia", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator9p);
            context.SaveChanges();

            var indicators9 = new Indicator[] {
                indicator9a, indicator9c, indicator9d, indicator9e, indicator9f, indicator9g, indicator9h,/* indicator9i, indicator9j,*/ indicator9k, indicator9l, indicator9m, indicator9n, indicator9o, indicator9p};

            roles[0].AddRangeRead(indicators9); // admin
            roles[0].AddRangeWrite(indicators9); // admin
            context.SaveChanges();

            roles[1].AddRangeRead(indicators9); // gerencia y direccion
            roles[1].AddRangeWrite(indicators9); // gerencia y direccion
            context.SaveChanges();

            roles[2].AddRangeRead(indicators9); // Encargado de OPS
            roles[2].AddRangeWrite(indicators9); // Encargado de OPS
            context.SaveChanges();

            roles[3].AddRangeRead(indicators9); // Analista de OPS
            context.SaveChanges();

            roles[7].AddRangeRead(indicators9); // Extensionista S
            roles[7].AddRangeWrite(indicators9); // Extensionista S
            context.SaveChanges();

            roles[8].AddRangeRead(indicators9); // Extensionista J
            roles[8].AddRangeWrite(indicators9); // Extensionista J
            context.SaveChanges();

            return indicators9;
        }
        private static Indicator[] CreateIndicatorsGroup10(DataContext context, long groupID)
        {
            var indicator10a = new Indicator{Name = "Cantidad de Nuevas entidades internacionales vinculadas al CET", RegistriesName = "", RegistriesType = RegistryType.DefaultRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre de la entidad nacional vinculada al CET.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator10a);
            context.SaveChanges();

            var indicator10b = new Indicator{Name = "Cantidad de Nuevas entidades nacionales vinculadas al CET", RegistriesName = "", RegistriesType = RegistryType.DefaultRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre de la entidad internacional vinculada al CET.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator10b);
            context.SaveChanges();

            var indicator10c = new Indicator{Name = "Cantidad empresas participantes en actividades de capacitación asociativas", RegistriesName = "empresas participantes", RegistriesType = RegistryType.QuantityRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre de la actividad de capacitación. En el valor de registro se debe especificar el número de empresas participantes en dicha actividad.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator10c);
            context.SaveChanges();

            var indicator10d = new Indicator{Name = "Cantidad de actividades de difusión en la que el CET participa", RegistriesName = "", RegistriesType = RegistryType.DefaultRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre de la actividad de difusión.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator10d);
            context.SaveChanges();

            var indicator10e = new Indicator{Name = "Cantidad Apariciones en prensa digital y escrita", RegistriesName = "", RegistriesType = RegistryType.DefaultRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar se debe ingresar el nombre de la aparición en la prensa digital. Como documentos también es posible colocar un enlace a un sitio web.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator10e);
            context.SaveChanges();

            var indicator10f = new Indicator{Name = "Cantidad de publicaciones en redes sociales", RegistriesName = "", RegistriesType = RegistryType.DefaultRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre de la aparición en la red social. Como documentos también es posible colocar un enlace a un sitio web.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator10f);
            context.SaveChanges();

            var indicator10g = new Indicator{Name = "Cantidad de empresas contactadas por medio plan comunicacional", RegistriesName = "", RegistriesType = RegistryType.DefaultRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar nombre de empresa contactada por plan comunicacional.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator10g);
            context.SaveChanges();
            
            var indicators10 = new Indicator[]{
                indicator10a, indicator10b, indicator10c, indicator10d, indicator10e, indicator10f, indicator10g};

            roles[0].AddRangeRead(indicators10); // admin
            roles[0].AddRangeWrite(indicators10); // admin
            context.SaveChanges();

            roles[1].AddRangeRead(indicators10); // gerencia y direccion
            roles[1].AddRangeWrite(indicators10); // gerencia y direccion
            context.SaveChanges();

            roles[2].AddRangeRead(indicators10); // Encargado de OPS
            context.SaveChanges();

            roles[3].AddRangeRead(indicators10); // Analista de OPS
            context.SaveChanges();

            roles[6].AddRangeRead(indicators10); // Ejecutiva técnica de control y seguimiento
            roles[6].AddRangeWrite(indicators10); // Ejecutiva técnica de control y seguimiento
            context.SaveChanges();

            roles[9].AddRead(indicator10e); // Periodista
            roles[9].AddRead(indicator10f);
            roles[9].AddRead(indicator10g);
            roles[9].AddWrite(indicator10e);
            roles[9].AddWrite(indicator10f);
            roles[9].AddWrite(indicator10g);

            return indicators10;
        }
        private static Indicator[] CreateIndicatorsGroup11(DataContext context, long groupID)
        {
            var indicator11a = new Indicator{Name = "Cantidad de académicos que participan en actividades del CET", RegistriesName = "", RegistriesType = RegistryType.DefaultRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre del académico que participa en actividades del CET.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator11a);
            context.SaveChanges();

            var indicator11b = new Indicator{Name = "Cantidad de estudiantes que realizan sus prácticas, tesis, proyectos de mejoramiento, memoria u otra actividad afín al CET", RegistriesName = "", RegistriesType = RegistryType.DefaultRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre del estudiante que realiza una actividad relacionada al CET.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator11b);
            context.SaveChanges();

            var indicators11 = new Indicator[]{
                indicator11a, indicator11b};

            roles[0].AddRangeRead(indicators11); // admin
            roles[0].AddRangeWrite(indicators11); // admin
            context.SaveChanges();

            roles[1].AddRangeRead(indicators11); // gerencia y direccion
            roles[1].AddRangeWrite(indicators11); // gerencia y direccion
            context.SaveChanges();

            roles[2].AddRangeRead(indicators11); // Encargado de OPS
            context.SaveChanges();

            roles[3].AddRangeRead(indicators11); // Analista de OPS
            context.SaveChanges();

            roles[6].AddRangeRead(indicators11); // Ejecutiva técnica de control y seguimiento S
            roles[6].AddRangeWrite(indicators11); // Ejecutiva técnica de control y seguimiento S

            roles[7].AddRangeRead(indicators11); // Extensionista S
            roles[7].AddRangeWrite(indicators11); // Extensionista S
            context.SaveChanges();

            roles[8].AddRangeRead(indicators11); // Extensionista J
            roles[8].AddRangeWrite(indicators11); // Extensionista J
            context.SaveChanges();

            return indicators11;
        }
        private static Indicator[] CreateIndicatorsGroup12(DataContext context, long groupID)
        {
            var indicator12a = new Indicator{Name = "Porcentaje de cumplimiento del presupuesto", RegistriesName = "% de cumplimiento del presupuesto", RegistriesType = RegistryType.PercentRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar un nombre cualquiera para mantener el presupuesto. En el valor de registro se debe especificar el porcentaje de cumplimiento del presupuesto. (Este porcentaje debe ser manejado de forma externa).", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator12a);
            context.SaveChanges();

            var indicators12 = new Indicator[]{
                indicator12a};

            roles[0].AddRangeRead(indicators12); // admin
            roles[0].AddRangeWrite(indicators12); // admin
            context.SaveChanges();

            roles[1].AddRangeRead(indicators12); // gerencia y direccion
            roles[1].AddRangeWrite(indicators12); // gerencia y direccion
            context.SaveChanges();

            roles[2].AddRangeRead(indicators12); // Encargado de OPS
            context.SaveChanges();

            roles[3].AddRangeRead(indicators12); // Analista de OPS
            context.SaveChanges();


            return indicators12;
        }
        private static Indicator[] CreateIndicatorsGroup13(DataContext context, long groupID)
        {
            var indicator13a = new Indicator { Name = "Cantidad de programas de formación implementados", RegistriesName = "", RegistriesType = RegistryType.DefaultRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre del programa implementado.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator13a);
            context.SaveChanges();

            var indicator13b = new Indicator { Name = "Cantidad de extensionistas y profesionales del Centro formados", RegistriesName = "", RegistriesType = RegistryType.DefaultRegistry, RegistriesDescription = "En el nombre del registro se debe ingresar el nombre del extensionista o profesional.", IndicatorGroupID = groupID };
            context.Indicators.Add(indicator13b);
            context.SaveChanges();

            var indicators13 = new Indicator[]{
                indicator13a, indicator13b};

            roles[0].AddRangeRead(indicators13); // admin
            roles[0].AddRangeWrite(indicators13); // admin
            context.SaveChanges();

            roles[1].AddRangeRead(indicators13); // gerencia y direccion
            roles[1].AddRangeWrite(indicators13); // gerencia y direccion
            context.SaveChanges();

            roles[2].AddRangeRead(indicators13); // Encargado de OPS
            context.SaveChanges();

            roles[3].AddRangeRead(indicators13); // Analista de OPS
            context.SaveChanges();
            
            return indicators13;
        }
        

        private static Role[] CreateRoles(DataContext context)
        {
            var role1 = new Role {RoleName = "Administración", RoleToken = "751381e9-91db-404c-94bb-dbb460551bda"};
            context.Add(role1);
            context.SaveChanges();

            var role2 = new Role {RoleName = "Gerencia y Dirección", RoleToken = "710534fb-6e71-4f30-0e33-b1ed2ae8d9bf"};
            context.Add(role2);
            context.SaveChanges();

            var role3 = new Role {RoleName = "Encargado de operaciones", RoleToken = "664b8e4c-d351-458d-84c7-315497168769"};
            context.Add(role3);
            context.SaveChanges();

            var role4 = new Role {RoleName = "Analista de operaciones", RoleToken = "12d1ed81-cd65-44df-6c19-0d23e9b54ce4"};
            context.Add(role4);
            context.SaveChanges();

            var role5 = new Role {RoleName = "Ejecutivo de post-venta", RoleToken = "9093a9fa-635b-46e8-a534-c402b43cf075"};
            context.Add(role5);
            context.SaveChanges();

            var role6 = new Role {RoleName = "Encargada de nuevos negocios", RoleToken = "75b671fe-80a4-41bc-8b14-7dcfa3786ec5"};
            context.Add(role6);
            context.SaveChanges();

            var role7 = new Role {RoleName = "Ejecutiva técnica de control y seguimiento", RoleToken = "dbf80ff3-26fc-48de-ebbf-820aef696179"};
            context.Add(role7);
            context.SaveChanges();

            var role8 = new Role {RoleName = "Extensionista senior", RoleToken = "2e2d4dfd-31ac-4465-eb38-768a228e1f3a"};
            context.Add(role8);
            context.SaveChanges();

            var role9 = new Role {RoleName = "Extensionista junior", RoleToken = "c02cd99a-b0ee-4653-33c9-309966b377b0"};
            context.Add(role9);
            context.SaveChanges();

            var role10 = new Role {RoleName = "Periodista", RoleToken = "b940f018-287a-4fc0-822c-66719353aa1b"};
            context.Add(role10);
            context.SaveChanges();

            var roles = new Role[] { role1, role2, role3, role4, role5, role6, role7, role8, role9, role10 };

            return roles;
            
        }
    }
}
