using System;

namespace RadiologyCenter.Api.Exceptions
{
    public class AppointmentException : Exception
    {
        public AppointmentException(string message) : base(message) { }
    }
} 