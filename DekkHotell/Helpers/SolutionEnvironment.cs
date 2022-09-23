namespace DekkHotell.Helpers
{
    public class SolutionEnvironment
    {
        public string GetCurrentPath()
        {
            return AppDomain.CurrentDomain.BaseDirectory;
        }
    }
}
