using System;

namespace _4WEBD.NotificationService.Razor.Template.Services.Interfaces;

public interface IRazorViewToStringRenderer
{
    Task<string> RenderViewToStringAsync<TModel>(string viewName, TModel model);
}
