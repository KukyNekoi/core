using DinkToPdf;
using DinkToPdf.Contracts;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace think_agro_metrics.Models
{
	public class LinkDocumentFactory : IDocumentFactory
	{
		public string folderName = "Repository";
		private Document _document;
		private IHostingEnvironment _hostingEnvironment;
		private IConverter _converter;

		public LinkDocumentFactory(Document document, IHostingEnvironment hostingEnvironment, IConverter converter)
		{
			_document = document;
			_hostingEnvironment = hostingEnvironment;
			_converter = converter;
		}

		public Document CreateDocument()
		{
			string webRootPath = _hostingEnvironment.WebRootPath;
			string newPath = Path.Combine(webRootPath, folderName);
			if (!Directory.Exists(newPath))
			{
				Directory.CreateDirectory(newPath);
			}
			string name = _document.Name + " (Respaldo autogenerado)";
			string link = "";

			using (var sha256 = SHA256.Create())
			{
				var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(name));
				var hash = BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
				link = hash;
			}

			string fullPath = Path.Combine(newPath, link);

			var doc = new HtmlToPdfDocument()
			{
				GlobalSettings = {
						ColorMode = ColorMode.Color,
						Orientation = Orientation.Portrait,
						PaperSize = PaperKind.A4,
						Margins = new MarginSettings() { Top = 10 },
						Out = fullPath,
					},
				Objects = {
						new ObjectSettings()
						{
							Page = _document.Link,
						},
					}
			};
			_converter.Convert(doc);

			//Create the FileDocument associated to the pdf back-up
			var document = new Document
			{
				Name = name,
				Link = link,
				Extension = ".pdf",
				DocumentName = name,
				Date = DateTime.Today
			};
			return document;
		}
	}
}
