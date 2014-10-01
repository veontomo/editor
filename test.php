<?php
	function fib($n){
		return ($n == 0 || $n == 1) ? 1 : fib($n-1) + fib($n-2);
	}

	function fib2($n, $a, $b){
		return ($n == 0 || $n == 1) ? $a : fib2($n-1, $a+$b, $a);
	}

	$nMax = 25;
	$tryMax = 10;
for ($n = 0; $n < $nMax; $n++){
	// echo "$n: ";
	$fractions = [];
	for ($try = 0; $try < $tryMax; $try++){
		$t1 = microtime(true);
		$res1 = fib2($n, 0, 1);
		$t2 =  microtime(true);
		$delta1 = $t2 - $t1;

		// echo "Standard:\n";
		// echo "fib2($n) = $res1\n";
		// echo 'time: ' . $delta1;
		// echo "\n";

		$t1 = microtime(true);
		$res2 = fib($n);
		$t2 =  microtime(true);
		$delta2 = $t2 - $t1;

		if ($res2 != $res2){
			throw new Exception("The functions give different results for $n-th Fibonacci number: $res1 (standard) vs $res2 (intelligent)", 1);

		}

		// echo "Intelligent:\n";
		// echo "fib($n) = $res2\n";
		// echo 'time: ' . $delta2;
		// echo "\n";

		// echo "Coefficient: " . ($delta2/$delta1);
		$fractions[] = $delta2/$delta1;
	}
	$frac = intval(1000*array_sum($fractions)/$tryMax)/1000;
	// echo "Average coefficient: " . (array_sum($fractions)/$tryMax) . "\n";
	echo "($n, $frac), ";

}



?>