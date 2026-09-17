'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ShieldAlert, CheckCircle2, AlertTriangle, Phone, Mail, MapPin, ChevronRight, Lock } from 'lucide-react';
import { use } from 'react';

type Step = 'LANDING' | 'CONSENT' | 'FORM' | 'SUCCESS';

export default function SubmitReportPage({ params }: { params: Promise<{ orgId: string }> }) {
  const unwrappedParams = use(params);
  const { organizations, addCase } = useAppStore();
  const [organization, setOrganization] = useState<any>(null);
  
  const [currentStep, setCurrentStep] = useState<Step>('LANDING');
  const [consentChecked, setConsentChecked] = useState(false);
  
  // Form state
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  
  const [department, setDepartment] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState('');
  const [description, setDescription] = useState('');
  
  const [password, setPassword] = useState('');
  const [generatedCaseNumber, setGeneratedCaseNumber] = useState('');

  useEffect(() => {
    const orgId = unwrappedParams.orgId;
    const foundOrg = organizations.find(o => o.id === orgId);
    if (foundOrg) {
      setOrganization(foundOrg);
    }
  }, [unwrappedParams, organizations]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !organization) return;

    let fullDescription = description;
    if (password) {
       // Just appending it to description in mock for demonstration. In real app, this goes to auth system.
       fullDescription += `\n\n[System Note: Reporter set a tracking password]`;
    }

    const caseNum = addCase({
      organizationId: organization.id,
      status: 'New — Needs Triage',
      description: fullDescription,
      severity: (severity as any) || 'Unrated',
      category: category || 'Other',
      department: department || 'Unspecified',
      incidentDate: incidentDate || undefined,
      source: 'Email', // Treating web submission as Email for simplicity
      reporterEmail: !isAnonymous ? reporterEmail.trim() : undefined,
      reporterPhone: !isAnonymous ? reporterPhone.trim() : undefined,
      assigneeIds: [],
    });

    setGeneratedCaseNumber(caseNum);
    setCurrentStep('SUCCESS');
  };

  if (!organization) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
            <CardTitle>Organization Not Found</CardTitle>
            <CardDescription>The intake link you used is invalid or has expired.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // STEP 1: LANDING PAGE
  if (currentStep === 'LANDING') {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="border-b pb-6">
            <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
              <ShieldAlert className="h-10 w-10 text-teal-600" />
              {organization.name} Ethics Portal
            </h1>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-slate-800 mb-4">File a Report</h2>
                <p className="text-slate-600 mb-4 leading-relaxed">
                  We are dedicated to upholding the highest standards of integrity, transparency, and ethical conduct. 
                  Reporting any wrongdoing is essential for maintaining these standards and fostering a safe work environment.
                </p>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  You can choose to remain completely anonymous or identify yourself. All reports are handled in a 
                  professional and confidential manner by the Ethics Committee.
                </p>
                <Button 
                  size="lg" 
                  className="bg-teal-600 hover:bg-teal-700 text-white w-full sm:w-auto"
                  onClick={() => setCurrentStep('CONSENT')}
                >
                  FILE A REPORT
                </Button>
                <p className="text-xs text-red-500 italic mt-4 font-medium">
                  Please Note: This system is hosted on secure TARI servers and is not part of {organization.name}'s internal network.
                </p>
              </div>
              
              <div className="pt-8 border-t">
                <h2 className="text-2xl font-semibold text-slate-800 mb-4">Track a Report</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Report Key:</Label>
                    <Input placeholder="Enter your 10-digit key" />
                  </div>
                  <div className="space-y-2">
                    <Label>Password:</Label>
                    <Input type="password" placeholder="Enter your password" />
                  </div>
                  <Button variant="outline" className="w-full sm:w-auto">Track Report</Button>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6 h-fit">
              <h3 className="text-xl font-semibold text-slate-800 border-b pb-3">Alternative Channels</h3>
              
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-teal-600 mt-1" />
                <div>
                  <p className="font-medium">Helpline (Toll-Free)</p>
                  <p className="text-sm text-slate-600">India: 1800-123-4567</p>
                  <p className="text-sm text-slate-600">US: (+1) 800-555-0199</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-teal-600 mt-1" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-slate-600">{organization.intakeEmail}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-teal-600 mt-1" />
                <div>
                  <p className="font-medium">Post</p>
                  <p className="text-sm text-slate-600">
                    TARI Ethics Committee<br />
                    Secure Box 404<br />
                    Global Business Park, City
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEP 2: CONSENT PAGE
  if (currentStep === 'CONSENT') {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <Card>
            <CardHeader className="bg-teal-600 text-white rounded-t-xl">
              <CardTitle>Privacy Consent and Pledge of Integrity</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <p className="font-medium">I pledge to -</p>
                <ol className="list-decimal pl-5 space-y-2 text-slate-700">
                  <li>Make my disclosure in good-faith.</li>
                  <li>Raise only those concerns for which I reasonably believe the information disclosed, and any allegation contained in it, are substantially true.</li>
                  <li>NOT victimize any colleague or third party by raising a false concern through this system.</li>
                  <li>NOT make any disclosure for the purposes of a personal gain.</li>
                  <li>NOT misuse this system in any manner and to use it responsibly.</li>
                  <li>Read and comply with the {organization.name} whistleblower policy before making a disclosure using this system.</li>
                  <li>I consent to providing my personal information to be processed by {organization.name} for the purpose it is being provided (if disclosing identity).</li>
                </ol>
              </div>

              <div className="flex items-center space-x-2 pt-4 border-t">
                <Checkbox 
                  id="consent" 
                  checked={consentChecked}
                  onCheckedChange={(c) => setConsentChecked(c as boolean)}
                />
                <label
                  htmlFor="consent"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I have read the pledge and agree to make a responsible disclosure.
                </label>
              </div>
              {!consentChecked && <p className="text-xs text-red-500 italic">(You must agree to the above in order to proceed)</p>}
            </CardContent>
            <CardFooter className="flex justify-between bg-slate-100 p-4 rounded-b-xl border-t">
              <Button variant="outline" onClick={() => setCurrentStep('LANDING')}>Cancel</Button>
              <Button 
                onClick={() => setCurrentStep('FORM')} 
                disabled={!consentChecked}
                className="bg-teal-600 hover:bg-teal-700"
              >
                Continue <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // STEP 4: SUCCESS PAGE
  if (currentStep === 'SUCCESS') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-lg shadow-lg border-teal-100">
          <CardHeader className="text-center">
            <CheckCircle2 className="mx-auto h-16 w-16 text-teal-500 mb-4" />
            <CardTitle className="text-2xl">Report Submitted Successfully</CardTitle>
            <CardDescription className="text-base mt-2">
              Your report has been securely transmitted to the compliance team at {organization.name}. 
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-slate-100 p-6 rounded-lg text-center space-y-2 border border-slate-200">
              <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">Your Report Key</p>
              <p className="text-3xl font-mono font-bold text-slate-900">{generatedCaseNumber}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 text-sm text-amber-800 flex gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <p>Please note down this Report Key and the password you created. You will need them to check for updates, answer follow-up questions from investigators, or add more evidence later.</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pb-8 pt-2">
            <Button onClick={() => window.location.reload()}>Return to Home</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // STEP 3: FORM PAGE
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Incident Report Form</h2>
          <p className="text-slate-600">For {organization.name}</p>
          <p className="text-xs text-red-500 mt-2">* indicates mandatory fields</p>
        </div>

        <Card className="shadow-xl border-slate-200">
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-8 pt-8">
              
              {/* Anonymity Section */}
              <div className="space-y-4 bg-slate-50 p-4 rounded-lg border">
                <div className="space-y-2">
                  <Label className="text-base">Do you wish to remain Anonymous for this report? <span className="text-red-500">*</span></Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="anonymous" checked={isAnonymous} onChange={() => setIsAnonymous(true)} className="h-4 w-4 text-teal-600" />
                      Yes
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="anonymous" checked={!isAnonymous} onChange={() => setIsAnonymous(false)} className="h-4 w-4 text-teal-600" />
                      No
                    </label>
                  </div>
                </div>

                {!isAnonymous && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="reporterName">Full Name</Label>
                      <Input id="reporterName" value={reporterName} onChange={(e) => setReporterName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reporterEmail">Email Address</Label>
                      <Input id="reporterEmail" type="email" value={reporterEmail} onChange={(e) => setReporterEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="reporterPhone">Phone Number</Label>
                      <Input id="reporterPhone" value={reporterPhone} onChange={(e) => setReporterPhone(e.target.value)} />
                    </div>
                  </div>
                )}
              </div>

              {/* Classification Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Business Unit / Department</Label>
                  <Select value={department} onValueChange={(val) => setDepartment(val || '')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="HR">Human Resources</SelectItem>
                      <SelectItem value="IT">IT / Engineering</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Approximate Date of Incident</Label>
                  <Input 
                    type="date" 
                    value={incidentDate} 
                    onChange={(e) => setIncidentDate(e.target.value)} 
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={(val) => setCategory(val || '')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Workplace Conduct">Workplace Conduct</SelectItem>
                      <SelectItem value="Financial Misconduct">Financial Misconduct</SelectItem>
                      <SelectItem value="Health & Safety">Health & Safety</SelectItem>
                      <SelectItem value="Data Privacy">Data Privacy</SelectItem>
                      <SelectItem value="Conflict of Interest">Conflict of Interest</SelectItem>
                      <SelectItem value="Theft/Fraud">Theft/Fraud</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Estimated Severity</Label>
                  <Select value={severity} onValueChange={(val) => setSeverity(val || '')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base">Please describe the matter <span className="text-red-500">*</span></Label>
                <p className="text-xs text-slate-500">Provide as much detail as possible, including names of individuals involved, specific locations, and how you became aware of the issue.</p>
                <Textarea
                  id="description"
                  required
                  rows={8}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="resize-y"
                />
              </div>

              {/* Security Section */}
              <div className="bg-slate-900 text-white p-6 rounded-lg space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-700 pb-3">
                  <Lock className="h-5 w-5 text-teal-400" />
                  <h3 className="font-semibold text-lg">Secure Your Report</h3>
                </div>
                <p className="text-sm text-slate-300">
                  You will be provided with a Report Key after you submit this report. Please create a password below. 
                  You will need both the Report Key and this password to track updates or communicate with investigators securely.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-300">Enter Password <span className="text-red-400">*</span></Label>
                    <Input 
                      id="password" 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>
              </div>

            </CardContent>
            <CardFooter className="bg-slate-100 border-t p-6 flex justify-between items-center rounded-b-xl">
              <Button type="button" variant="ghost" onClick={() => setCurrentStep('CONSENT')}>Back</Button>
              <Button type="submit" disabled={!description.trim() || !password} className="bg-teal-600 hover:bg-teal-700 text-white">
                Submit Report
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
