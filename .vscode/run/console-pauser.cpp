#include<stdio.h>
#include<stdlib.h>
#include<time.h>
#include<string>
#include<conio.h>
using namespace std;

int main(int argc, char **argv) {
	if(argc - 1 == 0) {
		printf("Usage: console-pauser <program> [<arguments...>]\n");
		return 3;
	}
	string cmd = string("\"") + argv[1] + string("\"");
	for(int i = 2; i < (int)argc; i++) {
		cmd += string(" ") + "\"" + argv[i] + "\"";
	}

	system("chcp 65001");

	while(true) {
		system("cls");
		int startClock = clock();
		int ch = system(cmd.c_str());
		int endClock = clock();

		printf("\n----------------\n");
		printf("Program finished in %.3lfs with exit code %u\n", double(endClock - startClock) / CLOCKS_PER_SEC, ch);
		printf("Press R to run again, or any other key to close...");
		
		char inp = getch();
		if(inp != 'R' && inp != 'r') {
			break;
		}
	}
}
