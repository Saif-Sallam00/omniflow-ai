import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell 
} from 'recharts';
import { ArrowRight, Calculator, DollarSign, Clock, Zap } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function ROICalculator() {
  // State for inputs
  const [employees, setEmployees] = useState([5]);
  const [hoursPerWeek, setHoursPerWeek] = useState([10]);
  const [hourlyRate, setHourlyRate] = useState([25]);

  // Calculations
  const weeklyCost = employees[0] * hoursPerWeek[0] * hourlyRate[0];
  const monthlyCost = weeklyCost * 4.33; // Average weeks in a month
  const annualCost = weeklyCost * 52;

  // Assume 90% efficiency gain with automation
  const efficiencyGain = 0.90;
  const annualSavings = annualCost * efficiencyGain;
  const monthlySavings = monthlyCost * efficiencyGain;
  const hoursSavedAnnually = (employees[0] * hoursPerWeek[0] * 52) * efficiencyGain;

  // Chart Data Generation
  const data = [
    {
      name: 'Current Cost',
      amount: annualCost,
      color: '#94a3b8', // slate-400
    },
    {
      name: 'With Automation',
      amount: annualCost - annualSavings, // Remaining cost (10%)
      color: '#2563eb', // blue-600
    },
  ];

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Animation for numbers (simple implementation)
  const [displaySavings, setDisplaySavings] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDisplaySavings(annualSavings), 100);
    return () => clearTimeout(timer);
  }, [annualSavings]);

  return (
    <section className="py-24 bg-[#0F172A] text-white overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Header Section */}
          <div className="lg:col-span-5 space-y-8">
            <Badge variant="outline" className="border-blue-500 text-blue-400 px-4 py-1 text-sm uppercase tracking-widest">
              <Calculator className="w-3 h-3 mr-2" />
              ROI Calculator
            </Badge>

            <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight">
              Stop Paying for <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                Repetitive Work
              </span>
            </h2>

            <p className="text-lg text-slate-400 leading-relaxed">
              Calculate how much your business wastes on manual data entry, scheduling, and repetitive tasks. See how OmniflowAI automation pays for itself.
            </p>

            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 uppercase tracking-wider font-medium">Potential Annual Savings</p>
                  <p className="text-3xl font-bold text-white">{formatCurrency(displaySavings)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Clock className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 uppercase tracking-wider font-medium">Hours Saved Annually</p>
                  <p className="text-3xl font-bold text-white">{Math.round(hoursSavedAnnually).toLocaleString()} hrs</p>
                </div>
              </div>
            </div>

            <Link href="/contact">
              <Button size="lg" className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white text-lg px-8 py-6 shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)]">
                Start Saving Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Calculator Interactive Section */}
          <div className="lg:col-span-7">
            <Card className="bg-slate-900 border-slate-800 shadow-2xl">
              <CardContent className="p-8">

                {/* Input Sliders */}
                <div className="space-y-10 mb-12">

                  {/* Slider 1 */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-slate-300">Employees doing manual tasks</label>
                      <span className="text-xl font-bold text-blue-400 bg-blue-400/10 px-3 py-1 rounded-md min-w-[60px] text-center">
                        {employees[0]}
                      </span>
                    </div>
                    <Slider
                      value={employees}
                      onValueChange={setEmployees}
                      max={50}
                      min={1}
                      step={1}
                      className="py-4"
                    />
                  </div>

                  {/* Slider 2 */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-slate-300">Hours per week (per person)</label>
                      <span className="text-xl font-bold text-blue-400 bg-blue-400/10 px-3 py-1 rounded-md min-w-[60px] text-center">
                        {hoursPerWeek[0]}
                      </span>
                    </div>
                    <Slider
                      value={hoursPerWeek}
                      onValueChange={setHoursPerWeek}
                      max={40}
                      min={1}
                      step={1}
                      className="py-4"
                    />
                  </div>

                  {/* Slider 3 */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-slate-300">Average Hourly Wage ($)</label>
                      <span className="text-xl font-bold text-blue-400 bg-blue-400/10 px-3 py-1 rounded-md min-w-[60px] text-center">
                        ${hourlyRate[0]}
                      </span>
                    </div>
                    <Slider
                      value={hourlyRate}
                      onValueChange={setHourlyRate}
                      max={200}
                      min={15}
                      step={5}
                      className="py-4"
                    />
                  </div>
                </div>

                {/* Visual Chart Area */}
                <div className="h-[250px] w-full bg-slate-950/50 rounded-xl p-4 border border-slate-800/50">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        tick={{ fill: '#94a3b8', fontSize: 12 }} 
                        width={100}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                        formatter={(value: number) => formatCurrency(value)}
                      />
                      <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={32}>
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6 flex items-start gap-3 text-sm text-slate-400 bg-slate-950/30 p-4 rounded-lg">
                  <Zap className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  <p>
                    <strong>Insight:</strong> You are currently spending <span className="text-white font-semibold">{formatCurrency(monthlyCost)}/mo</span> on manual labor. 
                    OmniflowAI could reduce this to approximately <span className="text-white font-semibold">{formatCurrency(monthlyCost - monthlySavings)}/mo</span>.
                  </p>
                </div>

              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </section>
  );
}