using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using think_agro_metrics.Models;

namespace think_agro_metrics.Data
{
    public static class DbInitializer
    {
        public static void Initialize(DataContext context)
        {
            context.Database.EnsureCreated();

            // Look for any indicator group.
            if (context.IndicatorGroups.Any())
            {
                return;   // DB has been seeded
            }

            var registries1a = CreateRegistries1A(context);
            var registries1b = CreateRegistries1B(context);
            var registries1c = CreateRegistries1C(context);
            var registries1d = CreateRegistries1D(context);
            var registries1e = CreateRegistries1E(context);
            var registries2a = CreateRegistries2A(context);
            var registries2b = CreateRegistries2B(context);
            var registries3a = CreateRegistries3A(context);
            var registries3b = CreateRegistries3B(context);
            var registries4c = CreateRegistries3B(context);
            var registries4d = CreateRegistries3B(context);

            context.Registries.AddRange(registries1a); context.SaveChanges();
            context.Registries.AddRange(registries1b); context.SaveChanges();
            context.Registries.AddRange(registries1c); context.SaveChanges();
            context.Registries.AddRange(registries1d); context.SaveChanges();
            context.Registries.AddRange(registries1e); context.SaveChanges();
            context.Registries.AddRange(registries2a); context.SaveChanges();
            context.Registries.AddRange(registries2b); context.SaveChanges();
            context.Registries.AddRange(registries3a); context.SaveChanges();
            context.Registries.AddRange(registries3b); context.SaveChanges();
            context.Registries.AddRange(registries4c); context.SaveChanges();
            context.Registries.AddRange(registries4d); context.SaveChanges();



            // INDICATORS
            var indicators1 = new Indicator[]
            {
                new Indicator{Name="Número de nuevas entidades internacionales vinculadas al CET", Registries = registries1a},
                new Indicator{Name="Número de nuevas entidades nacionales vinculadas al CET", Registries = registries1b},
                new Indicator{Name="Número de empresas participantes en actividades de capacitación asociativas", Registries = registries1c, Type = IndicatorType.QuantityIndicatorCalculator},
                new Indicator{Name="Número de apariciones en prensa digital y escrita", Registries = registries1d},
                new Indicator{Name="Número de actividades de difusión en la que el CET participa", Registries = registries1e}
            };

            var indicators2 = new Indicator[]
            {
                new Indicator{Name="Número de académicos que participan en actividades del CET", Registries = registries2a},
                new Indicator{Name="Número de estudiantes que realizan sus prácticas, tesis, proyectos de mejoramiento, memoria u otra actividad afín al CET", Registries = registries2b}
            };

            var indicators3 = new Indicator[]
            {
                new Indicator{Name="Número de programas de formación implementados", Registries = registries3a},
                new Indicator{Name="Número de extensionistas y profesionales del Centro formados", Registries = registries3b, Type=IndicatorType.QuantityIndicatorCalculator}
            };

            var indicators4 = new Indicator[]
            {
                new Indicator{Name="Número diagnósticos realizados a Pymes"},
                new Indicator{Name="Número de empresas asesoradas individualmente o en proceso de asesoria."},
                new Indicator{Name="Porcentaje de intervenciones efectivamente realizadas", Registries = registries4c, Type=IndicatorType.PercentIndicatorCalculator},
                new Indicator{Name="Porcentaje de subsidio por empresa.", Registries = registries4d, Type =IndicatorType.PercentIndicatorCalculator}

            };

            var indicators5 = new Indicator[]
            {
                new Indicator{Name="Porcentaje de satisfacción de empresas frutícolas"},
                new Indicator{Name="Porcentaje de satisfacción de empresas agroindustriales"}
            };

            var indicators6 = new Indicator[]
            {
                new Indicator{Name="Número de empresas con aumentos de productividad"},
                new Indicator{Name="Porcentaje de aumento de productividad de los clientes asesorados/as"}
            };

            var indicators7 = new Indicator[]
            {
                new Indicator{Name="Número de empresas con aumento de ventas"},
                new Indicator{Name="Porcentaje de aumento de ventas de los clientes asesorados/as que declararon ventas"}
            };

            var indicators8 = new Indicator[]
           {
                new Indicator{Name="Número de empresas con disminución de costos"},
                new Indicator{Name="Porcentaje de disminución de costos de los clientes asesorados/as"}
           };

            var indicators9 = new Indicator[]
            {
                new Indicator{Name="Número de empresas asesoradas con nuevos empleos formales"},
                new Indicator{Name="Porcentaje de aumento empleos de los clientes asesorados/as que declararon nuevos empleos"}
            };

            var indicators10 = new Indicator[]
            {
                new Indicator{Name="Número de empresas con aumento de inversión"},
                new Indicator{Name="Porcentaje de aumento de inversión de los clientes asesorados"}
            };

            context.Indicators.AddRange(indicators1); context.SaveChanges(); // Saved here to keep the indicators in order in the DB
            context.Indicators.AddRange(indicators2); context.SaveChanges();
            context.Indicators.AddRange(indicators3); context.SaveChanges();
            context.Indicators.AddRange(indicators4); context.SaveChanges();
            context.Indicators.AddRange(indicators5); context.SaveChanges();
            context.Indicators.AddRange(indicators6); context.SaveChanges();
            context.Indicators.AddRange(indicators7); context.SaveChanges();
            context.Indicators.AddRange(indicators8); context.SaveChanges();
            context.Indicators.AddRange(indicators9); context.SaveChanges();
            context.Indicators.AddRange(indicators10); context.SaveChanges();


            // INDICATOR GROUPS
            var indicatorGroups = new IndicatorGroup[]
            {
                new IndicatorGroup{Name="Vinculación con entidades nacionales e internacionales", Indicators=indicators1},
                new IndicatorGroup{Name="Vinculación con académicos y estudiantes", Indicators=indicators2},
                new IndicatorGroup{Name="Formación de los profesionales extensionistas e integrantes del equipo de gestión, en ámbitos relacionados al extensionismo tecnológico", Indicators=indicators3},
                new IndicatorGroup{Name="Prestación de servicios de extensionismo tecnológico a empresas", Indicators=indicators4},
                new IndicatorGroup{Name="Satisfacción de empresas por servicios prestados", Indicators=indicators5},
                new IndicatorGroup{Name="Estimación del aumento de productividad en empresas", Indicators=indicators6},
                new IndicatorGroup{Name="Estimación del aumento de ventas en empresas", Indicators=indicators7},
                new IndicatorGroup{Name="Estimación de la disminución de costos en empresas", Indicators=indicators8},
                new IndicatorGroup{Name="Estimación de la creación de nuevos empleos a partir de la prestación de servicios", Indicators=indicators9},
                new IndicatorGroup{Name="Estimación de aumento de inversiones de las empresas", Indicators=indicators10},
            };

            context.IndicatorGroups.AddRange(indicatorGroups);

            context.SaveChanges();
        }

        // Registries, Documents and Links
        private static Registry[] CreateRegistries1A(DataContext context)
        {

            var documents1a1 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca1a11",
                    DocumentName = "articulo1a11",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca1a12",
                    DocumentName = "articulo1a12",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents1a2 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca1a21",
                    DocumentName = "articulo1a21",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca1a22",
                    DocumentName = "articulo1a22",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents1a3 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca1a31",
                    DocumentName = "articulo1a31",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca1a32",
                    DocumentName = "articulo1a32",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents1a4 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca1a41",
                    DocumentName = "articulo1a41",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca1a42",
                    DocumentName = "articulo1a42",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents1a5 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca1a51",
                    DocumentName = "articulo1a51",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca1a52",
                    DocumentName = "articulo1a52",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents1a6 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca1a61",
                    DocumentName = "articulo1a61",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca1a62",
                    DocumentName = "articulo1a62",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents1a7 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca1a71",
                    DocumentName = "articulo1a71",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca1a72",
                    DocumentName = "articulo1a72",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents1a8 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca1a81",
                    DocumentName = "articulo1a81",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca1a82",
                    DocumentName = "articulo1a82",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents1a9 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca1a91",
                    DocumentName = "articulo1a91",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca1a92",
                    DocumentName = "articulo1a92",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents1a10 = new Document[]{
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1a101",
                     DocumentName = "articulo1a101",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                },
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1a102",
                     DocumentName = "articulo1a102",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                }
            };

            var registries1a = new Registry[] {
                new DefaultRegistry{
                    Name = "Apple Inc.",
                    Date = DateTime.Today,
                    Documents = documents1a1
                },
                new DefaultRegistry{
                    Name = "Microsoft Corp",
                    Date = new DateTime(2017,05,21),
                    Documents = documents1a2
                },
                new DefaultRegistry{
                    Name = "Amazon.com Inc",
                    Date = new DateTime(2017,09,12),
                    Documents = documents1a3
                },
                new DefaultRegistry{
                    Name = "Facebook Inc A",
                    Date = new DateTime(2020,02,01),
                    Documents = documents1a4
                },
                new DefaultRegistry{
                    Name = "Johnson & Johnson",
                    Date = new DateTime(2018,01,30),
                    Documents = documents1a5
                },
                new DefaultRegistry{
                    Name = "Berkshire Hathaway B",
                    Date = new DateTime(2019,11,14),
                    Documents = documents1a6
                },
                new DefaultRegistry{
                    Name = "JP Morgan Chase & Co",
                    Date = new DateTime(2020,12,04),
                    Documents = documents1a7
                },
                new DefaultRegistry{
                    Name = "Exxon Mobil Corp",
                    Date = new DateTime(2014,11,11),
                    Documents = documents1a8
                },
                new DefaultRegistry{
                    Name = "Alphabet Inc A",
                    Date = new DateTime(2018,03,07),
                    Documents = documents1a9
                },
                new DefaultRegistry{
                    Name = "Alphabet Inc C",
                    Date = new DateTime(2018,05,07),
                    Documents = documents1a10
                }

            };

            return registries1a;
        }

        private static Registry[] CreateRegistries1B(DataContext context)
        {
            var documents1b1 = new Document[]{
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1b11",
                     DocumentName = "articulo1b11",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                },
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1b12",
                     DocumentName = "articulo1b12",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                }
            };
            var documents1b2 = new Document[]{
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1b21",
                     DocumentName = "articulo1b21",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                },
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1b22",
                     DocumentName = "articulo1b22",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                }
            };
            var documents1b3 = new Document[]{
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1b31",
                     DocumentName = "articulo1b31",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                },
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1b32",
                     DocumentName = "articulo1b32",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                }
            };
            var documents1b4 = new Document[]{
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1b41",
                     DocumentName = "articulo1b41",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                },
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1b42",
                     DocumentName = "articulo1b42",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                }
            };
            var documents1b5 = new Document[]{
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1b51",
                     DocumentName = "articulo1b51",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                },
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1b52",
                     DocumentName = "articulo1b52",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                }
            };
            var documents1b6 = new Document[]{
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1b61",
                     DocumentName = "articulo1b61",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                },
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1b62",
                     DocumentName = "articulo1b62",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                }
            };
            var documents1b7 = new Document[]{
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1b71",
                     DocumentName = "articulo1b71",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                },
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1b72",
                     DocumentName = "articulo1b72",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                }
            };
            var documents1b8 = new Document[]{
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1b81",
                     DocumentName = "articulo1b81",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                },
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1b82",
                     DocumentName = "articulo1b82",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                }
            };
            var documents1b9 = new Document[]{
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1b91",
                     DocumentName = "articulo1b91",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                },
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1b92",
                     DocumentName = "articulo1b92",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                }
            };
            var documents1b10 = new Document[]{
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1b101",
                     DocumentName = "articulo1b101",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                },
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1b102",
                     DocumentName = "articulo1b102",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                }
            };

            var registries1b = new Registry[]
            {
                new DefaultRegistry{
                    Name = "Agrosuper",
                    Date = DateTime.Today,
                    Documents = documents1b1
                },
                new DefaultRegistry{
                    Name = "Banco de Credito e Inversiones(BCI)",
                    Date = new DateTime(2020,10,28),
                    Documents = documents1b2
                },
                new DefaultRegistry{
                    Name = "Carozzi",
                    Date = new DateTime(2019,09,19),
                    Documents = documents1b3
                },
                new DefaultRegistry{
                    Name = "Cencosud",
                    Date = new DateTime(2018,02,14),
                    Documents = documents1b4
                },
                new DefaultRegistry{
                    Name = "Compañia Cervecerías Unidas(CCU)",
                    Date = new DateTime(2020,12,21),
                    Documents = documents1b5
                },
                new DefaultRegistry{
                    Name = "Concha y Toro",
                    Date = new DateTime(2018,02,27),
                    Documents = documents1b6
                },
                new DefaultRegistry{
                    Name = "Empresa Nacional de Telecomunicaciones(ENTEL)",
                    Date = new DateTime(2018,03,16),
                    Documents = documents1b7
                },
                new DefaultRegistry{
                    Name = "Sociedad Quimica y Minera de Chile(SQM)",
                    Date = new DateTime(2018,04,09),
                    Documents = documents1b8
                },
                new DefaultRegistry{
                    Name = "Celulosa Arauco y Constitucion",
                    Date = new DateTime(2020,01,07),
                    Documents = documents1b9
                },
                new DefaultRegistry{
                    Name = "Copec",
                    Date = new DateTime(2018,02,13),
                    Documents = documents1b10
                }
            };
            return registries1b;
        }

        private static Registry[] CreateRegistries1C(DataContext context)
        {
            var documents1c1 = new Document[]{
                new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1c11",
                     DocumentName = "articulo1c11",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                },
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1c12",
                     DocumentName = "articulo1c12",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                }
            };
            var documents1c2 = new Document[]{
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1c21",
                     DocumentName = "articulo1c21",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                },
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1c22",
                     DocumentName = "articulo1c22",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                }
            };
            var documents1c3 = new Document[]{
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1c31",
                     DocumentName = "articulo1c31",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                },
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1c32",
                     DocumentName = "articulo1c32",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                }
            };
            var documents1c4 = new Document[]{
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1c41",
                     DocumentName = "articulo1c41",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                },
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1c42",
                     DocumentName = "articulo1c42",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                }
            };
            var documents1c5 = new Document[]{
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1c51",
                     DocumentName = "articulo1c51",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                },
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1c52",
                     DocumentName = "articulo1c52",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                }
            };
            var documents1c6 = new Document[]{
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1c61",
                     DocumentName = "articulo1c61",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                },
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1c62",
                     DocumentName = "articulo1c62",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                }
            };
            var documents1c7 = new Document[]{
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1c71",
                     DocumentName = "articulo1c71",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                },
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1c72",
                     DocumentName = "articulo1c72",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                }
            };
            var documents1c8 = new Document[]{
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1c81",
                     DocumentName = "articulo1c81",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                },
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1c82",
                     DocumentName = "articulo1c82",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                }
            };
            var documents1c9 = new Document[]{
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1c91",
                     DocumentName = "articulo1c91",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                },
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1c92",
                     DocumentName = "articulo1c92",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                }
            };
            var documents1c10 = new Document[]{
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1c101",
                     DocumentName = "articulo1c101",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                },
                 new Document{
                     Name = "Artículo de la Revista de la Universidad de Talca1c102",
                     DocumentName = "articulo1c102",
                     Extension = ".pdf",
                     Link = "www.utalca.cl"
                }
            };
            var registries1c = new QuantityRegistry[]
            {
                new QuantityRegistry{
                    Name = "Curso interpretación HACCP",
                    Date = DateTime.Today,
                    Quantity = 4,
                    Documents = documents1c1
                },
                new QuantityRegistry{
                    Name = "Curso Actualización FSSC 22000 versión 4.1",
                    Date = new DateTime(2017,05,24),
                    Quantity = 5,
                    Documents = documents1c2
                },
                new QuantityRegistry{
                    Name = "Webex ISO 9001:2019",
                    Date = new DateTime(2017,06,12),
                    Quantity = 3,
                    Documents = documents1c3
                },
                new QuantityRegistry{
                    Name = "Interpretación ISO 14001 y OHSAS 18001",
                    Date = new DateTime(2017,07,18),
                    Quantity = 3,
                    Documents = documents1c4
                },
                new QuantityRegistry{
                    Name = "Curso de Excel intermedio 2013",
                    Date = new DateTime(2017,08,20),
                    Quantity = 8,
                    Documents = documents1c5
                },
                new QuantityRegistry{
                    Name = "Webex ISO 45001:2018",
                    Date = new DateTime(2017,09,29),
                    Quantity = 5,
                    Documents = documents1c6
                },
                new QuantityRegistry{
                    Name = "Cierre de Ventas (servicio intangible)",
                    Date = new DateTime(2017,10,04),
                    Quantity = 4,
                    Documents = documents1c7
                },
                new QuantityRegistry{
                    Name = "Charla OTIC DEL COMERCIO B2B",
                    Date = new DateTime(2017,11,02),
                    Quantity = 4,
                    Documents = documents1c8
                },
                new QuantityRegistry{
                    Name = "Charla Red de Negocios Formación de Liderazgo",
                    Date = new DateTime(2017,12,19),
                    Quantity = 5,
                    Documents = documents1c9
                },
                new QuantityRegistry{
                    Name = "Auditor interno ISO 14001 y OHSAS 18001",
                    Date = new DateTime(2017,05,24),
                    Quantity = 9,
                    Documents = documents1c10
                }
            };

            return registries1c;
        }

        private static Registry[] CreateRegistries1D(DataContext context)
        {
            LinkWrapper link1 = new LinkWrapper { Value = "www.comunicando.com.es" };
            LinkWrapper link2 = new LinkWrapper { Value = "interactivadigital.com" };
            LinkWrapper link3 = new LinkWrapper { Value = "www.marketingnews.es" };
            LinkWrapper link4 = new LinkWrapper { Value = "www.utalca.cl" };
            LinkWrapper link5 = new LinkWrapper { Value = "www.jtaer.com" };
            LinkWrapper link6 = new LinkWrapper { Value = "ingenieria.utalca.cl" };
            LinkWrapper link7 = new LinkWrapper { Value = "www.elpublicista.es" };
            LinkWrapper link8 = new LinkWrapper { Value = "www.adtitudtv.com" };
            LinkWrapper link9 = new LinkWrapper { Value = "www.adlatina.com" };
            LinkWrapper link10 = new LinkWrapper { Value = "www.portalpublicitario.com" };
            context.Links.AddRange(link1, link2, link3, link4, link5, link6, link7, link8, link9, link10);

            var documents1d1 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1d11",
                    DocumentName = "articulo1d11",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1d12",
                    DocumentName = "articulo1d12",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents1d2 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1d21",
                    DocumentName = "articulo1d21",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1d22",
                    DocumentName = "articulo1d22",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents1d3 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1d31",
                    DocumentName = "articulo1d31",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1d32",
                    DocumentName = "articulo1d32",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents1d4 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1d41",
                    DocumentName = "articulo1d41",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1d42",
                    DocumentName = "articulo1d42",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents1d5 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1d51",
                    DocumentName = "articulo1d51",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1d52",
                    DocumentName = "articulo1d52",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents1d6 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1d61",
                    DocumentName = "articulo1d61",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1d62",
                    DocumentName = "articulo1d62",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents1d7 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1d71",
                    DocumentName = "articulo1d71",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1d72",
                    DocumentName = "articulo1d72",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents1d8 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1d81",
                    DocumentName = "articulo1d81",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1d82",
                    DocumentName = "articulo1d82",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents1d9 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1d91",
                    DocumentName = "articulo1d91",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1d92",
                    DocumentName = "articulo1d92",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents1d10 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1d101",
                    DocumentName = "articulo1d101",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1d102",
                    DocumentName = "articulo1d102",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };

            var registries1d = new LinkRegistry[]{
                new LinkRegistry{
                    Name = "ThinkAgro: Una ayuda a la innovacion.",
                    Date = new DateTime(2020,12,01),
                    Documents = documents1d1,
                    Links = new LinkWrapper[]{link1}
                },
                new LinkRegistry{
                    Name = "A la vanguardia: ThinkAgro se asoma como opcion de crecimiento.",
                    Date = new DateTime(2017,01,02),
                    Documents = documents1d2,
                    Links = new LinkWrapper[]{link2}
                },
                new LinkRegistry{
                    Name = "Campaña de lanzamiento de ThinkAgro.",
                    Date = new DateTime(2017,02,03),
                    Documents = documents1d3,
                    Links = new LinkWrapper[]{link3}
                },
                new LinkRegistry{
                    Name = "Una mirada al interior de ThinkAgro.",
                    Date = new DateTime(2017,03,04),
                    Documents = documents1d4,
                    Links = new LinkWrapper[]{link4}
                },
                new LinkRegistry{
                    Name = "Tomandose un cafe con ThinkAgro.",
                    Date = new DateTime(2017,04,05),
                    Documents = documents1d5,
                    Links = new LinkWrapper[]{link5}
                },
                new LinkRegistry{
                    Name = "ThinkAgro: Un proceso de crecimiento actual.",
                    Date = new DateTime(2017,05,06),
                    Documents = documents1d6,
                    Links = new LinkWrapper[]{link6}
                },
                new LinkRegistry{
                    Name = "El gran aporte de ThinkAgro a la comunidad local.",
                    Date = new DateTime(2017,06,07),
                    Documents = documents1d7,
                    Links = new LinkWrapper[]{link7}
                },
                new LinkRegistry{
                    Name = "Top 10 de empresas vanguardistas: ThinkAgro a la cabeza.",
                    Date = new DateTime(2017,07,08),
                    Documents = documents1d8,
                    Links = new LinkWrapper[]{link8}
                },
                new LinkRegistry{
                    Name = "Revelando la identidad de ThinkAgro.",
                    Date = new DateTime(2017,08,09),
                    Documents = documents1d9,
                    Links = new LinkWrapper[]{link9}
                },
                new LinkRegistry{
                    Name = "La comunidad se suma a la campaña de ThinkAgro.",
                    Date = new DateTime(2017,09,10),
                    Documents = documents1d10,
                    Links = new LinkWrapper[]{link10}
                }
            };

            return registries1d;
        }

        private static Registry[] CreateRegistries1E(DataContext context)
        {
            var documents1e1 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1e11",
                    DocumentName = "articulo1e11",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1e12",
                    DocumentName = "articulo1e12",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents1e2 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1e21",
                    DocumentName = "articulo1e21",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1e22",
                    DocumentName = "articulo1e22",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents1e3 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1e31",
                    DocumentName = "articulo1e31",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1e32",
                    DocumentName = "articulo1e32",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents1e4 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1e41",
                    DocumentName = "articulo1e41",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1e42",
                    DocumentName = "articulo1e42",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents1e5 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1e51",
                    DocumentName = "articulo1e51",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1e52",
                    DocumentName = "articulo1e52",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents1e6 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1e61",
                    DocumentName = "articulo1e61",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1e62",
                    DocumentName = "articulo1e62",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents1e7 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1e71",
                    DocumentName = "articulo1e71",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1e72",
                    DocumentName = "articulo1e72",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents1e8 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1e81",
                    DocumentName = "articulo1e81",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1e82",
                    DocumentName = "articulo1e82",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents1e9 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1e91",
                    DocumentName = "articulo1e91",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1e92",
                    DocumentName = "articulo1e92",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents1e10 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1e101",
                    DocumentName = "articulo1e101",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 1e102",
                    DocumentName = "articulo1e102",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var registries1e = new Registry[]
            {
                new DefaultRegistry{
                    Name = "Feria empresarial numero 14 de la Universidad de Talca.",
                    Date = DateTime.Today,
                    Documents = documents1e1
                },
                new DefaultRegistry{
                    Name = "Feria empresarial numero 21 de la Universidad de la Frontera.",
                    Date = new DateTime(2017,10,11),
                    Documents = documents1e2
                },
                new DefaultRegistry{
                    Name = "Feria empresarial numero 11 de la Universidad Catolica del Maule.",
                    Date = new DateTime(2017,11,12),
                    Documents = documents1e3
                },
                new DefaultRegistry{
                    Name = "Feria empresarial numero 22 de la Universidad de Santiago.",
                    Date = new DateTime(2017,12,13),
                    Documents = documents1e4
                },
                new DefaultRegistry{
                    Name = "Feria empresarial numero 41 de la Universidad de Chile.",
                    Date = new DateTime(2019,01,14),
                    Documents = documents1e5
                },
                new DefaultRegistry{
                    Name = "Feria empresarial numero 5 de la Universidad Autonoma.",
                    Date = new DateTime(2019,02,15),
                    Documents = documents1e6
                },
                new DefaultRegistry{
                    Name = "Feria empresarial numero 20 de la Universidad de Concepcion.",
                    Date = new DateTime(2019,03,16),
                    Documents = documents1e7
                },
                new DefaultRegistry{
                    Name = "Feria empresarial numero 4 de la Universidad Adolfo Ibañez.",
                    Date = new DateTime(2019,04,17),
                    Documents = documents1e8
                },
                new DefaultRegistry{
                    Name = "Feria empresarial numero 13 de la Universidad Catolica de Valpariso.",
                    Date = new DateTime(2017,05,18),
                    Documents = documents1e9
                },
                new DefaultRegistry{
                    Name = "Feria empresarial numero 25 de la Universidad Catolica de Santiago.",
                    Date = new DateTime(2017,06,19),
                    Documents = documents1e10
                }
            };

            return registries1e;
        }

        private static Registry[] CreateRegistries2A(DataContext context)
        {
            var documents2a1 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2a11",
                    DocumentName = "articulo2a11",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2a12",
                    DocumentName = "articulo2a12",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents2a2 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2a21",
                    DocumentName = "articulo2a21",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2a22",
                    DocumentName = "articulo2a22",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents2a3 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2a31",
                    DocumentName = "articulo2a31",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2a32",
                    DocumentName = "articulo2a32",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents2a4 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2a41",
                    DocumentName = "articulo2a41",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2a42",
                    DocumentName = "articulo2a42",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents2a5 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2a51",
                    DocumentName = "articulo2a51",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2a52",
                    DocumentName = "articulo2a52",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents2a6 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2a61",
                    DocumentName = "articulo2a61",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2a62",
                    DocumentName = "articulo2a62",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents2a7 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2a71",
                    DocumentName = "articulo2a71",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2a72",
                    DocumentName = "articulo2a72",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents2a8 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2a81",
                    DocumentName = "articulo2a81",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2a82",
                    DocumentName = "articulo2a82",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents2a9 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2a91",
                    DocumentName = "articulo2a91",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2a92",
                    DocumentName = "articulo2a92",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents2a10 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2a101",
                    DocumentName = "articulo2a101",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2a102",
                    DocumentName = "articulo2a102",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };

            var registries2a = new Registry[]
           {
                new DefaultRegistry{
                    Name = "Cesar Angles",
                    Date = DateTime.Today,
                    Documents = documents2a1
                },
                new DefaultRegistry{
                    Name = "Renzo Paredes",
                    Date = new DateTime(2020,04,13),
                    Documents = documents2a2
                },
                new DefaultRegistry{
                    Name = "Narciso Meza",
                    Date = new DateTime(2020,05,14),
                    Documents = documents2a3
                },
                new DefaultRegistry{
                    Name = "Pablo Allendes",
                    Date = new DateTime(2020,06,15),
                    Documents = documents2a4
                },
                new DefaultRegistry{
                    Name = "Rodolfo Garrido",
                    Date = new DateTime(2020,07,16),
                    Documents = documents2a5
                },
                new DefaultRegistry{
                    Name = "Matt Moreno",
                    Date = new DateTime(2020,08,17),
                    Documents = documents2a6
                },
                new DefaultRegistry{
                    Name = "Luis Pavez",
                    Date = new DateTime(2020,09,18),
                    Documents = documents2a7
                },
                new DefaultRegistry{
                    Name = "Daniel San Martin",
                    Date = new DateTime(2020,10,19),
                    Documents = documents2a8
                },
                new DefaultRegistry{
                    Name = "Rodrigo Mardones",
                    Date = new DateTime(2020,11,20),
                    Documents = documents2a9
                },
                new DefaultRegistry{
                    Name = "Wilfred Letelier",
                    Date = new DateTime(2020,12,21),
                    Documents = documents2a10
                }
           };
            return registries2a;
        }

        private static Registry[] CreateRegistries2B(DataContext context)
        {
            var documents2b1 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2b11",
                    DocumentName = "articulo2b11",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2b12",
                    DocumentName = "articulo2b12",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents2b2 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2b21",
                    DocumentName = "articulo2b21",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2b22",
                    DocumentName = "articulo2b22",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents2b3 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2b31",
                    DocumentName = "articulo2b31",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2b32",
                    DocumentName = "articulo2b32",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents2b4 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2b41",
                    DocumentName = "articulo2b41",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2b42",
                    DocumentName = "articulo2b42",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents2b5 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2b51",
                    DocumentName = "articulo2b51",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2b52",
                    DocumentName = "articulo2b52",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents2b6 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2b61",
                    DocumentName = "articulo2b61",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2b62",
                    DocumentName = "articulo2b62",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents2b7 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2b71",
                    DocumentName = "articulo2b71",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2b72",
                    DocumentName = "articulo2b72",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents2b8 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2b81",
                    DocumentName = "articulo2b81",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2b82",
                    DocumentName = "articulo2b82",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents2b9 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2b91",
                    DocumentName = "articulo2b91",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2b92",
                    DocumentName = "articulo2b92",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents2b10 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2b101",
                    DocumentName = "articulo2b101",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 2b102",
                    DocumentName = "articulo2b102",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            
            var registries2b = new Registry[]
            {
                new DefaultRegistry{
                    Name = "Daniel Pavez",
                    Date = DateTime.Today,
                    Documents = documents2b1
                },
                new DefaultRegistry{
                    Name = "Victor Reyes",
                    Date = new DateTime(2017,01,22),
                    Documents = documents2b2
                },
                new DefaultRegistry{
                    Name = "Nicolas Pradenas",
                    Date = new DateTime(2017,02,23),
                    Documents = documents2b3
                },
                new DefaultRegistry{
                    Name = "Alvaro Elgueda",
                    Date = new DateTime(2017,03,24),
                    Documents = documents2b4
                },
                new DefaultRegistry{
                    Name = "Erik Regla",
                    Date = new DateTime(2017,04,25),
                    Documents = documents2b5
                },
                new DefaultRegistry{
                    Name = "Yorch Sepulveda",
                    Date = new DateTime(2017,05,26),
                    Documents = documents2b6
                },
                new DefaultRegistry{
                    Name = "Reinaldo Jerez",
                    Date = new DateTime(2017,06,27),
                    Documents = documents2b7
                },
                new DefaultRegistry{
                    Name = "Narciso Cerpa",
                    Date = new DateTime(2017,07,28),
                    Documents = documents2b8
                },
                new DefaultRegistry{
                    Name = "Eugenio Peredo",
                    Date = new DateTime(2017,08,29),
                    Documents = documents2b9
                },
                new DefaultRegistry{
                    Name = "Jose Salvatierra",
                    Date = new DateTime(2017,09,11),
                    Documents = documents2b10
                }
           };
            return registries2b;
        }

        private static Registry[] CreateRegistries3A(DataContext context)
        {
            var documents3a1 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3a11",
                    DocumentName = "articulo3a11",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3a12",
                    DocumentName = "articulo3a12",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents3a2 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3a21",
                    DocumentName = "articulo3a21",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3a22",
                    DocumentName = "articulo3a22",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents3a3 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3a31",
                    DocumentName = "articulo3a31",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3a32",
                    DocumentName = "articulo3a32",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents3a4 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3a41",
                    DocumentName = "articulo3a41",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3a42",
                    DocumentName = "articulo3a42",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents3a5 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3a51",
                    DocumentName = "articulo3a51",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3a52",
                    DocumentName = "articulo3a52",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents3a6 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3a61",
                    DocumentName = "articulo3a61",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3a62",
                    DocumentName = "articulo3a62",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents3a7 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3a71",
                    DocumentName = "articulo3a71",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3a72",
                    DocumentName = "articulo3a72",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents3a8 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3a81",
                    DocumentName = "articulo3a81",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3a82",
                    DocumentName = "articulo3a82",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents3a9 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3a91",
                    DocumentName = "articulo3a91",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3a92",
                    DocumentName = "articulo3a92",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents3a10 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3a101",
                    DocumentName = "articulo3a101",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3a102",
                    DocumentName = "articulo3a102",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };

            var registries3a = new Registry[]
            {
                new DefaultRegistry{
                    Name = "Manejo de suelo y residuos",
                    Date = DateTime.Today,
                    Documents = documents3a1
                },
                new DefaultRegistry{
                    Name = "Manejo de técnicas de riego",
                    Date = new DateTime(2019,01,03),
                    Documents = documents3a2
                },
                new DefaultRegistry{
                    Name = "Técnicas de reprodución vegetal",
                    Date = new DateTime(2019,02,04),
                    Documents = documents3a3
                },
                new DefaultRegistry{
                    Name = "Alimentación y pesaje pecuario",
                    Date = new DateTime(2019,03,05),
                    Documents = documents3a4
                },
                new DefaultRegistry{
                    Name = "Control de plagas y enfermedades",
                    Date = new DateTime(2019,04,06),
                    Documents = documents3a5
                },
                new DefaultRegistry{
                    Name = "Técnicas de cultivo de especies vegetales",
                    Date = new DateTime(2019,05,07),
                    Documents = documents3a6
                },
                new DefaultRegistry{
                    Name = "Manejos para optimización productiva de frutales",
                    Date = new DateTime(2019,06,08),
                    Documents = documents3a7
                },
                new DefaultRegistry{
                    Name = "Postcosecha y guarda de productos agrícolas",
                    Date = new DateTime(2019,07,09),
                    Documents = documents3a8
                },
                new DefaultRegistry{
                    Name = "Mantenimiento de maquinarias y equipos agrícolas",
                    Date = new DateTime(2019,08,10),
                    Documents = documents3a9
                },
                new DefaultRegistry{
                    Name = "Emprendimiento y empleabilidad",
                    Date = new DateTime(2019,09,11),
                    Documents = documents3a10
                }
            };
            return registries3a;
        }

        private static Registry[] CreateRegistries3B(DataContext context)
        {
            var documents3b1 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3b11",
                    DocumentName = "articulo3b11",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3b12",
                    DocumentName = "articulo3b12",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents3b2 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3b21",
                    DocumentName = "articulo3b21",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3b22",
                    DocumentName = "articulo3b22",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents3b3 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3b31",
                    DocumentName = "articulo3b31",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3b32",
                    DocumentName = "articulo3b32",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents3b4 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3b41",
                    DocumentName = "articulo3b41",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3b42",
                    DocumentName = "articulo3b42",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents3b5 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3b51",
                    DocumentName = "articulo3b51",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3b52",
                    DocumentName = "articulo3b52",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents3b6 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3b61",
                    DocumentName = "articulo3b61",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3b62",
                    DocumentName = "articulo3b62",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents3b7 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3b71",
                    DocumentName = "articulo3b71",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3b72",
                    DocumentName = "articulo3b72",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents3b8 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3b81",
                    DocumentName = "articulo3b81",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3b82",
                    DocumentName = "articulo3b82",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents3b9 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3b91",
                    DocumentName = "articulo3b91",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3b92",
                    DocumentName = "articulo3b92",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };
            var documents3b10 = new Document[]{
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3b101",
                    DocumentName = "articulo3b101",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                },
                new Document{
                    Name = "Artículo de la Revista de la Universidad de Talca 3b102",
                    DocumentName = "articulo3b102",
                    Extension = ".pdf",
                    Link = "www.utalca.cl"
                }
            };

            var registries3b = new Registry[]
            {
                new QuantityRegistry{
                    Name = "Manejos pecuarios",
                    Date = DateTime.Today,
                    Quantity = 2,
                    Documents = documents3b1
                },
                new QuantityRegistry{
                    Name = "Reproducción animal",
                    Date = new DateTime(2019,09,12),
                    Quantity = 4,
                    Documents = documents3b2
                },
                new QuantityRegistry{
                    Name = "Producción lechera",
                    Date = new DateTime(2019,10,13),
                    Quantity = 6,
                    Documents = documents3b3
                },
                new QuantityRegistry{
                    Name = "Sanidad y bienestar animal",
                    Date = new DateTime(2019,11,14),
                    Quantity = 8,
                    Documents = documents3b4
                },
                new QuantityRegistry{
                    Name = "Cultivo de praderas y forrajes",
                    Date = new DateTime(2019,12,15),
                    Quantity = 12,
                    Documents = documents3b5
                },
                new QuantityRegistry{
                    Name = "Viticultura",
                    Date = new DateTime(2020,01,16),
                    Quantity = 14,
                    Documents = documents3b6
                },
                new QuantityRegistry{
                    Name = "Cosecha y transporte de vides",
                    Date = new DateTime(2020,02,17),
                    Quantity = 16,
                    Documents = documents3b7
                },
                new QuantityRegistry{
                    Name = "Elaboración de vinos.",
                    Date = new DateTime(2020,03,18),
                    Quantity = 18,
                    Documents = documents3b8
                },
                new QuantityRegistry{
                    Name = "Envasado y maquinaria vitivinícola",
                    Date = new DateTime(2020,04,19),
                    Quantity = 20,
                    Documents = documents3b9
                },
                new QuantityRegistry{
                    Name = "Manejo de bodegas vitivinícolas.",
                    Date = new DateTime(2020,05,20),
                    Quantity = 22,
                    Documents = documents3b10
                }
            };
            return registries3b;
        }
        /*
        private static Registry[] CreateRegistries4C(DataContext context){
            var registries4c = new Registry[]
            {
                new PercentRegistries{
                    Name = "Dole",
                    Date = DateTime.Today,
                    Percent = 25,
                    Documents = null //documents4c1
                },

                new PercentRegistries
                {
                    Name = "Santa Margarita",
                    Date = DateTime.Today,
                    Percent = 17,
                    Documents = null //documents4c2
                }
            };
            return registries4c;
        }

        private static Registry[] CreateRegistries4D(DataContext context){
            var registries4d = new Registry[]
            {
                new PercentRegistries{
                    Name = "Dole",
                    Date = DateTime.Today,
                    Percent = 25,
                    Documents = null //documents4d1
                },

                new PercentRegistries
                {
                    Name = "Santa Margarita",
                    Date = DateTime.Today,
                    Percent = 17,
                    Documents = null //documents4d2
                },

                new PercentRegistries
                {
                    Name = "Tio Genaro",
                    Date = DateTime.Today,
                    Percent = 40,
                    Documents = null //documents4d3
                }
            };
            return registries4d;
        }*/
    }
}
