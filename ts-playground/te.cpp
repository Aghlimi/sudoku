#include <iostream>
#include <string>
#include <vector>

using namespace	std;
int palindrome(string s, int index)
{
    int result = index;
    for (int i = 0; i < s.length() - index && index - i >= 0; i++)
    {
        if (s[index - i] != s[index + i])
            return result;
        result = index - i;
    }
    return (result);
}
string	longestPalindrome(string s)
{
	int	n;

	vector<string> sets;
	n = s.length();
	for (int i = 0; i < n; i++)
	{
        int index = palindrome(s, i);
        sets.push_back(s.substr(index, (i - index) * 2 + 1));
	}
    // print set
    for (const auto& str : sets)
    {
        cout << str << endl;
    }
    string res = "";
}
int main
()
{
    string s = "cbbd";
    cout << longestPalindrome(s) << endl;
    return (0);
}