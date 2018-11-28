---
layer: post
title: RSA Code in C
date: 2018-11-28
subtitle: RSA Algorithm
tag:
- cryptography
- code
---

{% highlight python %}

#include <stdio.h>
#include <stdlib.h>
#include <conio.h>
#include <time.h>
#include <string.h>
#include <Windows.h>

long long int find_prime_e(long long int p, long long int q);
long long int find_d(long long int p, long long int q, long long int e);
long long int pow(long long int a, long long int b);
void make_prime(long long int *a, long long int *b);
long long int* encrypt(char string[], long long int n, long long int e);
char* decrypt(long long int enc[], long long int n, long long int d);
long long int mod(long long int n, long long int e, long long int m);


int main()
{
​	long long int p, q, e, d, N, i;
​	long long int *enc;
​	char *dec, flag, tmp;
​	char string[1000];

```python
while (1)
{
	make_prime(&p, &q);

	e = find_prime_e(p, q);
	d = find_d(p, q, e);
	N = p * q;
	printf("p : %lld \t q : %lld \n", p, q);
	printf("N : %lld \t e : %lld \t d :  %lld \n", N, e, d);
	printf("input : ");
	gets(string);
	printf("after_encrypt : %s\n", string);

	enc = encrypt(string, N, e);
	printf("before_encrypt : ");
	for (i = 0; enc[i] != NULL; i++)
		printf("%d", enc[i]);

	printf("\n");

	dec = decrypt(enc, N, d);
	printf("decrypt : %s\n\n", dec);

	printf("retry 1, exit 2 : ");
	scanf("%c%c", &flag,&tmp);

	if (flag == '2')
		break;
}
```
}

long long int find_prime_e(long long int p, long long int q)
{
​	long long int i, j, flag;

```python
for (i = 2, flag = 0; i < q - 1; i++)
{
	flag = 0;

	for (j = 2; j <= i; j++)
	{
		if ((i%j == 0) && ((p - 1) % j == 0))
			flag++;
		if ((i%j == 0) && ((q - 1) % j == 0))
			flag++;
	}

	if (flag == 0)
		break;

}
return i;
```
}


long long int find_d(long long int p, long long int q, long long int e)
{
​	long long int i;

```python
for (i = 1;; i++)
{
	if ((e*i) % ((p - 1)*(q - 1)) == 1)
		return i;
}
```
}

long long int pow(long long int a, long long int b)
{
​	long long int tmp = 1, i;

```python
for (i = 0; i < b; i++)
	tmp *= a;

return tmp;
```

}

void make_prime(long long int *a, long long int *b)
{
​	int flag = 0, tmp, i, prime_num = 0;
​	srand(time(NULL));
​	while (prime_num != 2)
​	{
​		tmp = rand() % 10000000 + 1; // 2^10

```python
	flag = 0;
	for (i = 2; i <= tmp / 2; i++)
	{
		if (tmp%i == 0)
		{
			flag = 1;
			break;
		}
	}

	if (flag == 1)
		continue;
	else if (prime_num == 0)
	{
		prime_num++;
		*a = tmp;
	}
	else
	{
		prime_num++;
		*b = tmp;
	}
}
```

}

long long int* encrypt(char string[], long long int n, long long int e)
{
​	long long int i, j, k, flag, len = strlen(string);

```python
long long int *enc = (long long int*)malloc(sizeof(long long int)*len);

for (i = 0; i < len; i++)
	enc[i] = mod(string[i], e, n);
enc[i] = NULL;

return enc;
```
}

char* decrypt(long long int enc[], long long int n, long long int d)
{
​	long long int i, j, k, flag, len = 0;

```python
for (i = 0; enc[i] != NULL; i++)
	len++;

char *dec = (char*)malloc(sizeof(char)*len);

for (i = 0; i < len; i++)
	dec[i] = (char)mod((long long int)enc[i], d, n);
//dec[i] = pow(enc[i], d) % n;

dec[i] = NULL;
return dec;
```
}


long long int mod(long long int n, long long int e, long long int m)//n^e (mod m)을 수행한다.
{
​	long long int i, residue = 1;

```python
for (i = 1; i <= e; i++)
{
	residue *= n;
	residue %= m;
}

return residue;
```
}

{% endhighlight %}

흠... 스터디에서 RSA알고리즘을 구현해 봤는데 아직 여러 알고리즘이나 크고 작은 버그들을 추가로 고쳐야 할 것 같다. 