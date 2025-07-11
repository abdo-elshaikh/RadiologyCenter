using System;

namespace RadiologyCenter.Api.Exceptions
{
    public class UnitException : Exception
    {
        public UnitException(string message) : base(message) { }
    }
} 