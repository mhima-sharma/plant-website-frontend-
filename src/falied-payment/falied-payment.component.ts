import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-falied-payment',
  imports: [],
  templateUrl: './falied-payment.component.html',
  styleUrl: './falied-payment.component.css'
})
export class FaliedPaymentComponent implements OnInit{
  txnid: string | null = '';
  amount: string | null = '';
  status: string | null = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.txnid = params['txnid'];
      this.amount = params['amount'];
      this.status = params['status'];
  });

}
}