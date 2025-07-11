namespace RadiologyCenter.Api.Dto
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public ApiResponse(T data, string message = null)
        {
            Success = true;
            Data = data;
            Message = message;
        }
        public ApiResponse(string message)
        {
            Success = false;
            Message = message;
            Data = default;
        }
    }
} 