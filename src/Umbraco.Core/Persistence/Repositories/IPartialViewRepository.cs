﻿using System.IO;
using Umbraco.Cms.Core.Models;

namespace Umbraco.Cms.Core.Persistence.Repositories
{
    public interface IPartialViewRepository : IReadRepository<string, IPartialView>, IWriteRepository<IPartialView>
    {
        void AddFolder(string folderPath);
        void DeleteFolder(string folderPath);
        bool ValidatePartialView(IPartialView partialView);
        Stream GetFileContentStream(string filepath);
        void SetFileContent(string filepath, Stream content);
        long GetFileSize(string filepath);
    }
}
