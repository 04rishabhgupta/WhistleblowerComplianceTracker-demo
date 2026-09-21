'use client';

import { useState, useEffect, use } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ShieldAlert, CheckCircle2, AlertTriangle, Phone, Mail, MapPin, ChevronRight, Lock } from 'lucide-react';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { motion } from 'motion/react';

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
       fullDescription += `\n\n[System Note: Reporter set a tracking password]`;
    }

    const { caseNumber: caseNum } = addCase({
      organizationId: organization.id,
      status: 'Received',
      description: fullDescription,
      severity: (severity as any) || 'Unrated',
      category: category || 'Other',
      department: department || 'Unspecified',
      incidentDate: incidentDate || undefined,
      source: 'Email',
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
        <div className="w-full max-w-md shadow-lg bg-white rounded-xl p-8 text-center border">
          <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">Organization Not Found</h2>
          <p className="text-slate-500">The intake link you used is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  // STEP 1: LANDING PAGE
  if (currentStep === 'LANDING') {
    return (
      <div className="dark min-h-screen w-full flex flex-col bg-black text-foreground font-sans overflow-y-auto overflow-x-hidden selection:bg-accent selection:text-white">
        <AuroraBackground className="w-full min-h-screen">
          <motion.div
            initial={{ opacity: 0.0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
            className="relative z-10 w-full max-w-5xl mx-auto flex flex-col px-6 mt-12 mb-20"
          >
            <div className="border-b border-white/10 pb-6 mb-12">
              <h1 className="text-4xl md:text-5xl font-black text-white flex items-center gap-4">
                <ShieldAlert className="h-12 w-12 text-teal-400" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-300">
                  {organization.name} Ethics Portal
                </span>
              </h1>
            </div>

            <div className="grid md:grid-cols-5 gap-8">
              <div className="md:col-span-3 space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">File a Report</h2>
                  <p className="text-lg text-slate-300 mb-4 leading-relaxed font-light">
                    We are dedicated to upholding the highest standards of integrity, transparency, and ethical conduct. 
                    Reporting any wrongdoing is essential for maintaining these standards and fostering a safe work environment.
                  </p>
                  <p className="text-lg text-slate-300 mb-8 leading-relaxed font-light">
                    You can choose to remain completely anonymous or identify yourself. All reports are handled in a 
                    professional and confidential manner by the Ethics Committee.
                  </p>
                  <Button 
                    size="lg" 
                    className="bg-teal-600 hover:bg-teal-500 text-white rounded-full px-8 h-14 text-lg"
                    onClick={() => setCurrentStep('CONSENT')}
                  >
                    FILE A REPORT <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                  <p className="text-sm text-red-400 italic mt-6 font-medium">
                    Please Note: This system is hosted on secure TARI servers and is not part of {organization.name}&apos;s internal network.
                  </p>
                </div>
                
                <div className="pt-8 border-t border-white/10">
                  <h2 className="text-2xl font-bold text-white mb-6">Track a Report</h2>
                  <div className="space-y-5 max-w-md">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Report Key:</Label>
                      <Input className="bg-white/5 border-white/10 text-white focus-visible:ring-teal-500" placeholder="Enter your 10-digit key" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Password:</Label>
                      <Input type="password" className="bg-white/5 border-white/10 text-white focus-visible:ring-teal-500" placeholder="Enter your password" />
                    </div>
                    <Button variant="outline" className="w-full sm:w-auto rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10">Track Report</Button>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <CardSpotlight className="h-full w-full p-8 flex flex-col justify-start">
                  <h3 className="text-2xl font-bold text-white border-b border-white/10 pb-4 mb-6 relative z-20">Alternative Channels</h3>
                  
                  <div className="space-y-8 relative z-20">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-teal-500/10 text-teal-400">
                        <Phone className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-medium text-white text-lg">Helpline (Toll-Free)</p>
                        <p className="text-sm text-slate-400 mt-1">India: 1800-123-4567</p>
                        <p className="text-sm text-slate-400">US: (+1) 800-555-0199</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-teal-500/10 text-teal-400">
                        <Mail className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-medium text-white text-lg">Email</p>
                        <p className="text-sm text-slate-400 mt-1">{organization.intakeEmail}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-teal-500/10 text-teal-400">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-medium text-white text-lg">Post</p>
                        <p className="text-sm text-slate-400 mt-1">
                          TARI Ethics Committee<br />
                          Secure Box 404<br />
                          Global Business Park, City
                        </p>
                      </div>
                    </div>
                  </div>
                </CardSpotlight>
              </div>
            </div>
          </motion.div>
        </AuroraBackground>
      </div>
    );
  }

  // STEP 2: CONSENT PAGE
  if (currentStep === 'CONSENT') {
    return (
      <div className="dark min-h-screen w-full flex flex-col bg-black text-foreground font-sans selection:bg-accent selection:text-white">
        <AuroraBackground className="w-full min-h-screen">
          <motion.div
            initial={{ opacity: 0.0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-full max-w-3xl mx-auto px-4"
          >
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-teal-900/40 border-b border-white/10 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-teal-400" />
                  Privacy Consent and Pledge of Integrity
                </h2>
              </div>
              <div className="p-8 space-y-8">
                <div className="space-y-4">
                  <p className="font-medium text-lg text-white">I pledge to -</p>
                  <ol className="list-decimal pl-5 space-y-3 text-slate-300">
                    <li>Make my disclosure in good-faith.</li>
                    <li>Raise only those concerns for which I reasonably believe the information disclosed, and any allegation contained in it, are substantially true.</li>
                    <li>NOT victimize any colleague or third party by raising a false concern through this system.</li>
                    <li>NOT make any disclosure for the purposes of a personal gain.</li>
                    <li>NOT misuse this system in any manner and to use it responsibly.</li>
                    <li>Read and comply with the {organization.name} whistleblower policy before making a disclosure using this system.</li>
                    <li>I consent to providing my personal information to be processed by {organization.name} for the purpose it is being provided (if disclosing identity).</li>
                  </ol>
                </div>

                <div className="flex items-start space-x-3 pt-6 border-t border-white/10">
                  <Checkbox 
                    id="consent" 
                    checked={consentChecked}
                    onCheckedChange={(c) => setConsentChecked(c as boolean)}
                    className="mt-1 border-slate-500 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500 data-[state=checked]:text-white"
                  />
                  <div className="space-y-1">
                    <label
                      htmlFor="consent"
                      className="text-base font-medium text-white cursor-pointer"
                    >
                      I have read the pledge and agree to make a responsible disclosure.
                    </label>
                    {!consentChecked && <p className="text-sm text-red-400 italic">(You must agree to the above in order to proceed)</p>}
                  </div>
                </div>
              </div>
              <div className="bg-black/40 border-t border-white/10 p-6 flex justify-between items-center">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5" onClick={() => setCurrentStep('LANDING')}>Cancel</Button>
                <Button 
                  onClick={() => setCurrentStep('FORM')} 
                  disabled={!consentChecked}
                  className="bg-teal-600 hover:bg-teal-500 text-white rounded-full px-6"
                >
                  Continue <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </AuroraBackground>
      </div>
    );
  }

  // STEP 4: SUCCESS PAGE
  if (currentStep === 'SUCCESS') {
    return (
      <div className="dark min-h-screen w-full flex flex-col items-center justify-center bg-black text-foreground font-sans selection:bg-accent selection:text-white p-4">
        <AuroraBackground className="w-full min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0.0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-full max-w-lg"
          >
            <div className="bg-slate-900/80 backdrop-blur-xl border border-teal-500/30 rounded-3xl overflow-hidden shadow-2xl text-center">
              <div className="p-10 space-y-6">
                <div className="mx-auto w-20 h-20 bg-teal-500/10 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="h-10 w-10 text-teal-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">Report Submitted Successfully</h2>
                <p className="text-slate-300 text-lg">
                  Your report has been securely transmitted to the compliance team at {organization.name}. 
                </p>
                
                <div className="bg-black/60 p-6 rounded-2xl border border-white/5 space-y-3 mt-8">
                  <p className="text-sm text-teal-400 font-semibold uppercase tracking-widest">Your Report Key</p>
                  <p className="text-4xl font-mono font-bold text-white tracking-wider">{generatedCaseNumber}</p>
                </div>
                
                <div className="bg-amber-950/30 p-5 rounded-xl border border-amber-500/20 text-sm text-amber-200/90 flex gap-4 text-left mt-6">
                  <AlertTriangle className="h-6 w-6 shrink-0 text-amber-400" />
                  <p className="leading-relaxed">Please securely save this Report Key and the password you created. You will absolutely need them to check for updates, answer follow-up questions from investigators, or add more evidence later.</p>
                </div>
              </div>
              <div className="bg-black/40 border-t border-teal-500/20 p-6 flex justify-center">
                <Button onClick={() => window.location.reload()} className="bg-white text-black hover:bg-slate-200 rounded-full px-8 h-12 text-base font-semibold">
                  Return to Home
                </Button>
              </div>
            </div>
          </motion.div>
        </AuroraBackground>
      </div>
    );
  }

  // STEP 3: FORM PAGE
  return (
    <div className="dark min-h-screen bg-black text-foreground font-sans py-12 px-4 sm:px-6 lg:px-8 selection:bg-accent selection:text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Incident Report Form</h2>
          <p className="text-xl text-teal-400 font-light">For {organization.name}</p>
          <p className="text-sm text-red-400 mt-4">* indicates mandatory fields</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-8 space-y-10">
              
              {/* Anonymity Section */}
              <div className="space-y-6 bg-black/40 p-6 rounded-xl border border-white/5">
                <div className="space-y-3">
                  <Label className="text-lg text-white">Do you wish to remain Anonymous for this report? <span className="text-red-500">*</span></Label>
                  <div className="flex gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                      <input type="radio" name="anonymous" checked={isAnonymous} onChange={() => setIsAnonymous(true)} className="h-5 w-5 accent-teal-500" />
                      Yes, remain anonymous
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                      <input type="radio" name="anonymous" checked={!isAnonymous} onChange={() => setIsAnonymous(false)} className="h-5 w-5 accent-teal-500" />
                      No, I will identify myself
                    </label>
                  </div>
                </div>

                {!isAnonymous && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-white/10">
                    <div className="space-y-2">
                      <Label htmlFor="reporterName" className="text-slate-300">Full Name</Label>
                      <Input id="reporterName" value={reporterName} onChange={(e) => setReporterName(e.target.value)} className="bg-slate-950 border-slate-800 text-white focus-visible:ring-teal-500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reporterEmail" className="text-slate-300">Email Address</Label>
                      <Input id="reporterEmail" type="email" value={reporterEmail} onChange={(e) => setReporterEmail(e.target.value)} className="bg-slate-950 border-slate-800 text-white focus-visible:ring-teal-500" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="reporterPhone" className="text-slate-300">Phone Number</Label>
                      <Input id="reporterPhone" value={reporterPhone} onChange={(e) => setReporterPhone(e.target.value)} className="bg-slate-950 border-slate-800 text-white focus-visible:ring-teal-500" />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Classification Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-slate-300">Business Unit / Department</Label>
                  <Select value={department} onValueChange={(val) => setDepartment(val || '')}>
                    <SelectTrigger className="bg-slate-950 border-slate-800 text-white focus-visible:ring-teal-500">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
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
                  <Label className="text-slate-300">Approximate Date of Incident</Label>
                  <Input 
                    type="date" 
                    value={incidentDate} 
                    onChange={(e) => setIncidentDate(e.target.value)} 
                    className="bg-slate-950 border-slate-800 text-white focus-visible:ring-teal-500 [color-scheme:dark]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Category</Label>
                  <Select value={category} onValueChange={(val) => setCategory(val || '')}>
                    <SelectTrigger className="bg-slate-950 border-slate-800 text-white focus-visible:ring-teal-500">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
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
                  <Label className="text-slate-300">Estimated Severity</Label>
                  <Select value={severity} onValueChange={(val) => setSeverity(val || '')}>
                    <SelectTrigger className="bg-slate-950 border-slate-800 text-white focus-visible:ring-teal-500">
                      <SelectValue placeholder="Select Severity" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-3">
                <Label htmlFor="description" className="text-lg text-white">Please describe the matter <span className="text-red-500">*</span></Label>
                <p className="text-sm text-slate-400">Provide as much detail as possible, including names of individuals involved, specific locations, and how you became aware of the issue.</p>
                <Textarea
                  id="description"
                  required
                  rows={8}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="resize-y bg-slate-950 border-slate-800 text-white text-base p-4 focus-visible:ring-teal-500"
                  placeholder="Type your detailed report here..."
                />
              </div>

              {/* Security Section */}
              <div className="bg-teal-950/30 border border-teal-500/20 text-white p-6 rounded-xl space-y-4">
                <div className="flex items-center gap-3 border-b border-teal-500/20 pb-4">
                  <Lock className="h-6 w-6 text-teal-400" />
                  <h3 className="font-semibold text-xl">Secure Your Report</h3>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  You will be provided with a Report Key after you submit this report. Please create a password below. 
                  You will need both the Report Key and this password to track updates or communicate with investigators securely.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-teal-100">Enter Password <span className="text-red-400">*</span></Label>
                    <Input 
                      id="password" 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-black/50 border-teal-500/30 text-white focus-visible:ring-teal-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

            </div>
            <div className="bg-black/40 border-t border-slate-800 p-6 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
              <Button type="button" variant="ghost" onClick={() => setCurrentStep('CONSENT')} className="text-slate-400 hover:text-white w-full sm:w-auto">Back</Button>
              <Button type="submit" disabled={!description.trim() || !password} className="bg-teal-600 hover:bg-teal-500 text-white rounded-full px-8 h-12 w-full sm:w-auto text-base">
                Submit Report
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
