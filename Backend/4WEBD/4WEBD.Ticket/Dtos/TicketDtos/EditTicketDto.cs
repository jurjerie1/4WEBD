using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace _4WEBD.Ticket.Dtos.TicketDtos;

public class EditTicketDto
{
    [Required(ErrorMessage = "L'id de l'événement est requis.")]
    public Guid EventId { get; set; }
    
    [Required(ErrorMessage = "Le nombre de places est requis.")]
    [Range(1, int.MaxValue, ErrorMessage = "Le nombre de places doit être supérieur à 0.")]
    [DefaultValue(1)]
    public int NumberOfPlaces { get; set; }
}
