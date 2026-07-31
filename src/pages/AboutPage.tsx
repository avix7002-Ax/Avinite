import { Bot, Code2, Heart, Mail, Sparkles, Star, Zap, BookOpen, Award, Users, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function AboutPage() {
  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Hero */}
      <div className="text-center py-8">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-accent mb-6">
          <Bot className="h-12 w-12 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Science PYQs AI</h1>
        <p className="text-lg text-muted-foreground">Powered by Avix AI</p>
        <p className="text-sm text-muted-foreground mt-2">Your Smart Learning & Student Companion</p>
      </div>

      {/* Version badge */}
      <div className="flex justify-center">
        <Badge variant="secondary" className="text-sm px-4 py-2">Version 1.0</Badge>
      </div>

      {/* Developer card */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" />
            Developer & Designer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent">
              <span className="text-2xl font-bold text-white">AK</span>
            </div>
            <div>
              <h3 className="text-lg font-bold">Avinash Kumar</h3>
              <p className="text-sm text-muted-foreground">Founder, CEO & Lead Developer</p>
              <p className="text-sm text-muted-foreground">Science PYQs AI</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-center">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <BookOpen className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-1">Complete Revision</h3>
              <p className="text-sm text-muted-foreground">Notes, flashcards, formulas, mnemonics, and last-minute shots for all 16 chapters of CBSE Class 10 Science.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Star className="h-8 w-8 text-warning mb-3" />
              <h3 className="font-semibold mb-1">PYQ Series</h3>
              <p className="text-sm text-muted-foreground">Original practice questions with model answers, references, and writing tips for every chapter.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Zap className="h-8 w-8 text-accent mb-3" />
              <h3 className="font-semibold mb-1">Avix AI</h3>
              <p className="text-sm text-muted-foreground">Dual-mode AI assistant for academic support and student companionship with voice and image support.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Award className="h-8 w-8 text-success mb-3" />
              <h3 className="font-semibold mb-1">Progress Tracking</h3>
              <p className="text-sm text-muted-foreground">Quiz scores, accuracy trends, strong/weak chapters, and revision progress all in one place.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mission */}
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="pt-6">
          <Sparkles className="h-8 w-8 text-primary mb-3" />
          <h3 className="font-semibold mb-2">Our Mission</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            To provide every CBSE Class 10 student with a premium, AI-powered revision platform that makes board exam preparation simple, effective, and accessible. Students should be able to revise the complete syllabus using notes, flashcards, formula sheets, mnemonics, last-minute shots, PYQ series, quizzes, and progress tracking — all without needing additional study material.
          </p>
        </CardContent>
      </Card>

      {/* Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Shield className="h-8 w-8 text-success mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Accuracy</h3>
            <p className="text-xs text-muted-foreground mt-1">All content verified against NCERT syllabus. We never provide misleading information.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="h-8 w-8 text-accent mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Accessible</h3>
            <p className="text-xs text-muted-foreground mt-1">Free tier with essential features. Pro unlock for just ₹30 one-time.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Heart className="h-8 w-8 text-error mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Student First</h3>
            <p className="text-xs text-muted-foreground mt-1">Designed for students, by a student. Every feature solves a real revision need.</p>
          </CardContent>
        </Card>
      </div>

      {/* Copyright */}
      <div className="text-center py-6 border-t border-border">
        <p className="text-sm text-muted-foreground">
          © 2026 Science PYQs AI. All Rights Reserved.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Developed & Designed by Avinash Kumar
        </p>
      </div>
    </div>
  );
}
