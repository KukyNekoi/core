using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace think_agro_metrics.Models
{
	public class FileDocumentFactory : IDocumentFactory
	{
		public string folderName = "Repository";
		private IFormFile file;
		private IHostingEnvironment _hostingEnvironment;

		public FileDocumentFactory(IFormFile file, IHostingEnvironment hostingEnvironment)
		{
			this.file = file;
			_hostingEnvironment = hostingEnvironment;
		}

		public Document CreateDocument( )
		{
			string name = "";
			string link = "";
			string webRootPath = _hostingEnvironment.WebRootPath;
			string newPath = Path.Combine(webRootPath, folderName);
			if (!Directory.Exists(newPath))
			{
				Directory.CreateDirectory(newPath);
			}

			if (file.Length > 0)
			{
				string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
				string fecha = DateTime.Now.ToString("MM/dd/yyyy hh:mm:ss.fff");

				name = fileName;

				using (var sha256 = SHA256.Create())
				{
					// Send a sample text to hash.  
					var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(fileName + fecha));
					// Get the hashed string.  
					var hash = BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
					fileName = hash;
					//link = hash;
				}
				link = fileName;
				string fullPath = Path.Combine(newPath, fileName);
				using (var stream = new FileStream(fullPath, FileMode.Create))
				{
					file.CopyTo(stream);
				}
			}

			var document = new Document();
			document.Link = link;
			int fileExtPos = name.LastIndexOf(".");
			string ext = name.Substring(fileExtPos);
			document.Extension = ext;
			string documentName = name.Substring(0, fileExtPos);
			document.DocumentName = documentName;
			document.Name = documentName;
			return document;
		}
	}
}
