import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-success-payment',
  templateUrl: './success-payment.component.html',
  styleUrls: ['./success-payment.component.css']
})
export class SuccessPaymentComponent implements OnInit {
  txnid: string | null = '';
  amount: string | null = '';
  status: string | null = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.txnid = this.route.snapshot.queryParamMap.get('txnid');
    this.amount = this.route.snapshot.queryParamMap.get('amount');
    this.status = this.route.snapshot.queryParamMap.get('status');

    if (this.txnid && this.status) {
      // ✅ Call backend to update payment status
      this.http.post('http://localhost:3000/api/payment/update-easebuzz-status', {
        txnid: this.txnid,
        status: this.status
      }).subscribe({
        next: (res) => console.log('Payment status updated successfully', res),
        error: (err) => console.error('Failed to update payment status', err)
      });
    }
  }
}
