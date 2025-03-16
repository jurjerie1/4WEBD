namespace _4WEBD.Event.Dtos.EventDto;
using System.ComponentModel.DataAnnotations;

public class EventDto
{
    public Guid Id { get; set; }
    [Required (ErrorMessage = "Le nom est obligatoire.")]
    public string Name { get; set; }
    [Required (ErrorMessage = "La description est obligatoire.")]
    public string Description { get; set; }
    [Required (ErrorMessage = "La date est obligatoire.")]
    public DateTime Date { get; set; }
    [Required (ErrorMessage = "La localisation est obligatoire.")]
    public string Location { get; set; }
    [Required (ErrorMessage = "L'image est obligatoire.")]
    public string Image { get; set; }
    
}