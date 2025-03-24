using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace _4WEBD.Event.Dtos.EventDto
{
    public class EditEventDto
    {
        [Required(ErrorMessage = "Le titre est obligatoire.")]
        public string Title { get; set; }

        [Required(ErrorMessage = "La description est obligatoire.")]
        public string Description { get; set; }

        [Required(ErrorMessage = "La date est obligatoire.")]
        [DataType(DataType.DateTime)]
        public DateTime Date { get; set; }

        [Required(ErrorMessage = "La localisation est obligatoire.")]
        public string Location { get; set; }

        [Required(ErrorMessage = "L'image est obligatoire.")]
        public IFormFile Image { get; set; }

        [Required(ErrorMessage = "Le nombre de places est obligatoire.")]
        [Range(1, int.MaxValue, ErrorMessage = "Le nombre de places doit être d'au moins 1.")]
        public int NumberOfPlaces { get; set; }
    }
}
