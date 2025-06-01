import { Component } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  comptes = [
    { type: 'Courant', solde: 12500.50, devise: 'EUR' },
    { type: 'Épargne', solde: 8600.00, devise: 'EUR' }
  ];

  // ⚙️ Options pour le line chart
  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
  };

  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai'],
    datasets: [
      {
        data: [12000, 13500, 11000, 14500, 15000],
        label: 'Solde Total',
        fill: true,
        tension: 0.3,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
      }
    ]
  };

  // ⚙️ Options pour le pie chart
  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Courses', 'Transports', 'Loisirs', 'Santé', 'Autres'],
    datasets: [
      {
        data: [500, 250, 150, 100, 200],
        backgroundColor: ['#4ade80', '#60a5fa', '#facc15', '#f87171', '#c084fc']
      }
    ]
  };
}
