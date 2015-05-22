high=30;
low=4;
value = linspace(low-1,high+1,1000);

value_clamped = clamp(value,low,high);

colorvalue_lin = (value_clamped-low)/(high-low);

colorvalue_sqrt = sqrt((value_clamped-low)/(high-low));

colorvalue_pwr = ((value_clamped-low)/(high-low)).^0.45;

plot(value,[colorvalue_lin; colorvalue_sqrt; colorvalue_pwr]);
legend('lin','sqrt', 'pwr');
title('The indicator color tranformation function options');
xlabel('Impact per KM');
ylabel('Color HSL value (0=120 degrees, 1=0 degrees)');
savefig('colors.fig');
matlab2tikz('colors.tikz', 'height', '\figureheight', 'width', '\figurewidth');