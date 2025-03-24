using System;
using System.Security.Cryptography;

namespace _4WEBD.Ticket.models;

public class ConfirmationTicket
{
    #region Properties
    public Guid Id { get; set; }
    public Guid TicketId { get; set; }
    public TicketModel Ticket { get; set; }
    public string ConfirmToken { get; set; }
    public DateTime Date { get; set; }
    public TicketAction Action { get; set; }

    #endregion

    #region Constructor
    public ConfirmationTicket()
    {
        Id = new Guid();
        Date = DateTime.UtcNow;
        ConfirmToken = GenerateRandomToken();
    }
    #endregion

    #region Private Methods
    private string GenerateRandomToken(int length = 32)
    {
        using (var rng = RandomNumberGenerator.Create())
        {
            byte[] tokenData = new byte[length];
            rng.GetBytes(tokenData);

            string token = Convert.ToBase64String(tokenData);

            token = token.Replace("+", "-").Replace("/", "_").Replace("=", "");

            return token.Substring(0, Math.Min(token.Length, length));
        }
    }
    #endregion
}

public enum TicketAction
{
    Confirm,
    Delete,
}