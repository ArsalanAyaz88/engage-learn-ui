
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BankAccount, paymentService } from "@/services/paymentService";
import { WalletCards, CreditCard, Copy, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const Payments: React.FC = () => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        const data = await paymentService.getBankAccounts();
        setBankAccounts(data);
      } catch (error) {
        console.error("Failed to fetch bank accounts:", error);
        toast.error("Failed to load payment information");
      } finally {
        setLoading(false);
      }
    };

    fetchBankAccounts();
  }, []);

  const copyToClipboard = (text: string, id: string | number) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(id.toString());
        toast.success("Copied to clipboard");
        
        setTimeout(() => {
          setCopied(null);
        }, 2000);
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy to clipboard");
      });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">
            Manage your payments and view payment history
          </p>
        </div>

        <Tabs defaultValue="bank-transfer" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="bank-transfer">Bank Transfer</TabsTrigger>
            <TabsTrigger value="payment-history">Payment History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bank-transfer" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <WalletCards className="h-5 w-5" /> Bank Account Details
                </CardTitle>
                <CardDescription>
                  Use these details to make a bank transfer payment for your course enrollment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))
                ) : bankAccounts.length === 0 ? (
                  <div className="text-center py-6">
                    <CreditCard className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <p className="mt-4 text-lg font-medium">No bank accounts available</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Please contact support for payment information.
                    </p>
                  </div>
                ) : (
                  bankAccounts.map((account) => (
                    <Card key={account.id} className="bg-slate-800">
                      <CardHeader>
                        <CardTitle className="text-lg">{account.bank_name}</CardTitle>
                        <CardDescription>Account Holder: {account.account_holder}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`account-number-${account.id}`}>Account Number</Label>
                          <div className="flex items-center space-x-2">
                            <Input 
                              id={`account-number-${account.id}`} 
                              value={account.account_number} 
                              readOnly 
                              className="bg-slate-700"
                            />
                            <Button 
                              size="icon" 
                              variant="outline" 
                              onClick={() => copyToClipboard(account.account_number, account.id)}
                              className="flex-shrink-0"
                            >
                              {copied === account.id.toString() ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        {account.branch_code && (
                          <div className="space-y-2">
                            <Label htmlFor={`branch-code-${account.id}`}>Branch Code</Label>
                            <div className="flex items-center space-x-2">
                              <Input 
                                id={`branch-code-${account.id}`} 
                                value={account.branch_code} 
                                readOnly 
                                className="bg-slate-700"
                              />
                              <Button 
                                size="icon" 
                                variant="outline" 
                                onClick={() => copyToClipboard(account.branch_code!, account.id + "-branch")}
                                className="flex-shrink-0"
                              >
                                {copied === (account.id + "-branch").toString() ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  After making a transfer, please submit your payment proof in the course enrollment section.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="payment-history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" /> Payment History
                </CardTitle>
                <CardDescription>
                  View your previous payments and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <CreditCard className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No payment history yet</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your payment records will appear here once you've made payments.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Payments;
