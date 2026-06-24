import { useState } from 'react';
import { generateLinkedInPost, generateEmail } from '../services/claude';

export default function Share({ data }) {
  const [linkedinPost, setLinkedinPost] = useState('');
  const [emailData, setEmailData] = useState(null);
  const [generating, setGenerating] = useState('');

  const handleLinkedIn = async () => {
    setGenerating('linkedin');
    const post = await generateLinkedInPost(data.repoInfo.name, data.analysis?.summary, data.analysis?.version?.recommended);
    setLinkedinPost(post);
    setGenerating('');
  };

  const handleEmail = async () => {
    setGenerating('email');
    const result = await generateEmail(data.repoInfo.name, data.analysis?.summary, data.stakeholders, data.analysis?.version?.recommended);
    setEmailData(result);
    setGenerating('');
  };

  const openGmail = () => {
    if (!emailData) return;
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`, '_blank');
  };

  const openLinkedIn = () => {
    if (!linkedinPost) return;
    navigator.clipboard.writeText(linkedinPost);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=https://github.com/${data.repoInfo.full_name}`, '_blank');
    alert('Post copied to clipboard! Paste it on LinkedIn.');
  };

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div style={{ background: '#0a1628', border: '1px solid #0077b5', borderRadius: 12, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, color: '#0ea5e9' }}>💼 LinkedIn Announcement</h3>
          <button onClick={handleLinkedIn} disabled={generating === 'linkedin'} style={{ padding: '10px 20px', background: '#0077b5', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
            {generating === 'linkedin' ? '⏳ Generating...' : '✨ Generate Post'}
          </button>
        </div>
        {linkedinPost && (
          <div>
            <textarea value={linkedinPost} onChange={e => setLinkedinPost(e.target.value)} rows={8} style={{ width: '100%', background: '#0f172a', color: '#e2e8f0', border: '1px solid #0077b5', borderRadius: 8, padding: 12, fontSize: 14, lineHeight: 1.7, resize: 'vertical', boxSizing: 'border-box' }} />
            <button onClick={openLinkedIn} style={{ marginTop: 10, padding: '10px 20px', background: '#0077b5', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
              🚀 Copy & Open LinkedIn
            </button>
          </div>
        )}
      </div>

      <div style={{ background: '#1a0a00', border: '1px solid #ea4335', borderRadius: 12, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, color: '#f87171' }}>📧 Gmail Release Email</h3>
          <button onClick={handleEmail} disabled={generating === 'email'} style={{ padding: '10px 20px', background: '#ea4335', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
            {generating === 'email' ? '⏳ Generating...' : '✨ Generate Email'}
          </button>
        </div>
        {emailData && (
          <div>
            <input value={emailData.subject} onChange={e => setEmailData({ ...emailData, subject: e.target.value })} style={{ width: '100%', background: '#0f0a00', color: '#e2e8f0', border: '1px solid #ea433580', borderRadius: 8, padding: '10px 12px', fontSize: 14, marginBottom: 10, boxSizing: 'border-box' }} />
            <textarea value={emailData.body} onChange={e => setEmailData({ ...emailData, body: e.target.value })} rows={8} style={{ width: '100%', background: '#0f0a00', color: '#e2e8f0', border: '1px solid #ea433580', borderRadius: 8, padding: 12, fontSize: 14, lineHeight: 1.7, resize: 'vertical', boxSizing: 'border-box' }} />
            <button onClick={openGmail} style={{ marginTop: 10, padding: '10px 20px', background: '#ea4335', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
              📧 Open in Gmail
            </button>
          </div>
        )}
      </div>
    </div>
  );
}