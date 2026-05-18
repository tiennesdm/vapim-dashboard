import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import StatusBadge from '@/components/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Lock, Shield, Clock, AlertTriangle, Upload, Eye, Download } from 'lucide-react';

const certificates = [
  { alias: 'gateway-ssl-cert', type: 'SSL', issuedTo: '*.vedadb.io', issuedBy: 'Let\'s Encrypt Authority X3', validFrom: '2025-04-01', validUntil: '2025-07-01', status: 'Valid', daysLeft: 42 },
  { alias: 'jwt-signing-key', type: 'JWT', issuedTo: 'VedaDB API Manager', issuedBy: 'VedaDB Internal CA', validFrom: '2025-01-01', validUntil: '2027-01-01', status: 'Valid', daysLeft: 589 },
  { alias: 'client-auth-ca', type: 'Client', issuedTo: 'VedaDB Client CA', issuedBy: 'VedaDB Root CA', validFrom: '2024-06-01', validUntil: '2029-06-01', status: 'Valid', daysLeft: 1840 },
  { alias: 'admin-dashboard-ssl', type: 'SSL', issuedTo: 'admin.vedadb.io', issuedBy: 'Let\'s Encrypt Authority X3', validFrom: '2025-03-15', validUntil: '2025-06-15', status: 'Expiring Soon', daysLeft: 28 },
  { alias: 'legacy-intermediate', type: 'SSL', issuedTo: 'VedaDB Legacy', issuedBy: 'DigiCert SHA2', validFrom: '2023-01-01', validUntil: '2025-05-20', status: 'Expired', daysLeft: -2 },
  { alias: 'm2m-communication', type: 'Client', issuedTo: 'Internal Services', issuedBy: 'VedaDB Internal CA', validFrom: '2025-02-01', validUntil: '2026-02-01', status: 'Valid', daysLeft: 258 },
];

export default function Certificates() {
  return (
    <Layout>
      <PageHeader title="Certificates" description="SSL/TLS certificate management" actions={
        <Button className="bg-[#4488FF] hover:bg-[#5C9DFF] text-[12px]">
          <Upload className="w-4 h-4 mr-2" /> Upload Certificate
        </Button>
      } />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Certificates', value: '6', icon: <Lock className="w-5 h-5" />, color: '#4488FF' },
          { label: 'Valid', value: '4', icon: <Shield className="w-5 h-5" />, color: '#10B981' },
          { label: 'Expiring Soon', value: '1', icon: <Clock className="w-5 h-5" />, color: '#F59E0B' },
          { label: 'Expired', value: '1', icon: <AlertTriangle className="w-5 h-5" />, color: '#EF4444' },
        ].map(kpi => (
          <Card key={kpi.label} className="bg-[#1A1D23] border-[#3D434F]">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${kpi.color}20`, color: kpi.color }}>
                {kpi.icon}
              </div>
              <div>
                <div className="text-[11px] text-[#6B7280] uppercase tracking-wider">{kpi.label}</div>
                <div className="text-xl font-bold text-[#E8ECF1]">{kpi.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Certificates Table */}
      <Card className="bg-[#1A1D23] border-[#3D434F]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-[#E8ECF1]">All Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[#3D434F] hover:bg-transparent">
                <TableHead className="text-[#6B7280]">Alias</TableHead>
                <TableHead className="text-[#6B7280]">Type</TableHead>
                <TableHead className="text-[#6B7280]">Issued To</TableHead>
                <TableHead className="text-[#6B7280]">Issued By</TableHead>
                <TableHead className="text-[#6B7280]">Valid Until</TableHead>
                <TableHead className="text-[#6B7280]">Status</TableHead>
                <TableHead className="text-[#6B7280]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certificates.map(cert => (
                <TableRow key={cert.alias} className="border-[#3D434F] hover:bg-[#353942]/50">
                  <TableCell className="text-[#E8ECF1] font-medium font-mono text-[12px]">{cert.alias}</TableCell>
                  <TableCell>
                    <Badge className={cert.type === 'SSL' ? 'bg-[#4488FF20] text-[#4488FF]' : cert.type === 'JWT' ? 'bg-[#8B5CF620] text-[#8B5CF6]' : 'bg-[#10B98120] text-[#10B981]'}>
                      {cert.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#E8ECF1]">{cert.issuedTo}</TableCell>
                  <TableCell className="text-[#9DA5B4] text-[12px]">{cert.issuedBy}</TableCell>
                  <TableCell className="text-[#9DA5B4]">{cert.validUntil}</TableCell>
                  <TableCell>
                    {cert.status === 'Valid' && <StatusBadge status="PUBLISHED" />}
                    {cert.status === 'Expiring Soon' && <Badge className="bg-[#F59E0B20] text-[#F59E0B]">Expiring Soon</Badge>}
                    {cert.status === 'Expired' && <Badge className="bg-[#EF444420] text-[#EF4444]">Expired</Badge>}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-[#9DA5B4] hover:text-[#E8ECF1]">
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#1A1D23] border-[#3D434F] text-[#E8ECF1] max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Certificate: {cert.alias}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-3 text-[13px]">
                            <div className="grid grid-cols-2 gap-2">
                              <div><span className="text-[#6B7280]">Type:</span> {cert.type}</div>
                              <div><span className="text-[#6B7280]">Status:</span> {cert.status}</div>
                              <div><span className="text-[#6B7280]">Issued To:</span> {cert.issuedTo}</div>
                              <div><span className="text-[#6B7280]">Issued By:</span> {cert.issuedBy}</div>
                              <div><span className="text-[#6B7280]">Valid From:</span> {cert.validFrom}</div>
                              <div><span className="text-[#6B7280]">Valid Until:</span> {cert.validUntil}</div>
                              <div><span className="text-[#6B7280]">Days Left:</span> {cert.daysLeft}</div>
                            </div>
                            <div className="p-3 bg-[#181A20] rounded border border-[#3D434F] font-mono text-[11px] text-[#9DA5B4] mt-3">
                              -----BEGIN CERTIFICATE-----<br/>
                              MIIDXTCCAkWgAwIBAgIJAJC1HiIAZAiUMA0GCSqGSIb3QaWbbaG9L<br/>
                              ... (truncated) ...<br/>
                              -----END CERTIFICATE-----
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-[#9DA5B4] hover:text-[#E8ECF1]">
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Expiry Alerts */}
      <Card className="mt-6 bg-[#1A1D23] border-[#3D434F]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-[#E8ECF1]">Expiry Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {certificates.filter(c => c.daysLeft <= 30).map(cert => (
            <div key={cert.alias} className={`p-3 rounded-lg border ${cert.daysLeft < 0 ? 'bg-[#EF444410] border-[#EF444430]' : 'bg-[#F59E0B10] border-[#F59E0B30]'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-medium text-[#E8ECF1]">{cert.alias}</div>
                  <div className="text-[11px] text-[#9DA5B4]">Expires: {cert.validUntil}</div>
                </div>
                <Badge className={cert.daysLeft < 0 ? 'bg-[#EF444420] text-[#EF4444]' : 'bg-[#F59E0B20] text-[#F59E0B]'}>
                  {cert.daysLeft < 0 ? `${Math.abs(cert.daysLeft)} days overdue` : `${cert.daysLeft} days left`}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </Layout>
  );
}
