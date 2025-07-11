using System;

namespace RadiologyCenter.Api.Exceptions
{
    public class ExaminationException : Exception
    {
        public ExaminationException(string message) : base(message) { }
    }
} 