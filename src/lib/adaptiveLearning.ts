/**
 * Adaptive Learning System for Go Tutorial
 * Implements progressive difficulty, skill assessment, and mastery gates
 */

export interface LearningMetrics {
  userId: string;
  lessonId: string;
  attempts: number;
  successes: number;
  failures: number;
  timeSpent: number;
  hintsUsed: number;
  lastAttempt: Date;
  masteryLevel: number; // 0-100
  weakAreas: string[];
  strongAreas: string[];
}

export interface DifficultyLevel {
  id: string;
  name: string;
  boardSize: 5 | 7 | 9;
  complexity: number; // 1-10
  requiredMastery: number; // 0-100
  unlocks: string[];
}

export interface AdaptiveConfig {
  masteryThreshold: number; // 80% by default
  maxAttemptsPerLesson: number;
  hintPenalty: number;
  timeBonus: number;
  spacedRepetitionInterval: number;
}

export interface SkillAssessment {
  captureAbility: number;
  territorialUnderstanding: number;
  tacticalThinking: number;
  strategicThinking: number;
  patternRecognition: number;
  overallRating: number;
}

export interface Hint {
  id: string;
  type: 'visual' | 'textual' | 'interactive';
  content: string;
  penalty: number;
  prerequisite?: string;
}

export interface LearningPath {
  id: string;
  name: string;
  lessons: string[];
  prerequisites: string[];
  estimatedTime: number;
  difficulty: number;
}

export class AdaptiveLearningEngine {
  private metrics: Map<string, LearningMetrics> = new Map();
  private difficultyLevels: DifficultyLevel[] = [];
  private adaptiveConfig: AdaptiveConfig;
  private skillAssessments: Map<string, SkillAssessment> = new Map();

  constructor(config?: Partial<AdaptiveConfig>) {
    this.adaptiveConfig = {
      masteryThreshold: 80,
      maxAttemptsPerLesson: 10,
      hintPenalty: 5,
      timeBonus: 2,
      spacedRepetitionInterval: 24 * 60 * 60 * 1000, // 24 hours
      ...config
    };

    this.initializeDifficultyLevels();
  }

  private initializeDifficultyLevels(): void {
    this.difficultyLevels = [
      {
        id: 'beginner',
        name: 'Beginner',
        boardSize: 5,
        complexity: 2,
        requiredMastery: 0,
        unlocks: ['basic-capture', 'simple-liberties']
      },
      {
        id: 'novice',
        name: 'Novice',
        boardSize: 7,
        complexity: 4,
        requiredMastery: 60,
        unlocks: ['group-capture', 'territory-basics']
      },
      {
        id: 'intermediate',
        name: 'Intermediate',
        boardSize: 9,
        complexity: 6,
        requiredMastery: 75,
        unlocks: ['life-death', 'joseki-patterns']
      },
      {
        id: 'advanced',
        name: 'Advanced',
        boardSize: 9,
        complexity: 8,
        requiredMastery: 85,
        unlocks: ['complex-life-death', 'professional-patterns']
      },
      {
        id: 'expert',
        name: 'Expert',
        boardSize: 9,
        complexity: 10,
        requiredMastery: 95,
        unlocks: ['tournament-preparation', 'ai-analysis']
      }
    ];
  }

  /**
   * Track user performance for a lesson
   */
  public trackLessonAttempt(
    userId: string,
    lessonId: string,
    success: boolean,
    timeSpent: number,
    hintsUsed: number = 0
  ): void {
    const key = `${userId}-${lessonId}`;
    const existing = this.metrics.get(key) || this.createNewMetrics(userId, lessonId);
    
    existing.attempts++;
    if (success) {
      existing.successes++;
    } else {
      existing.failures++;
    }
    
    existing.timeSpent += timeSpent;
    existing.hintsUsed += hintsUsed;
    existing.lastAttempt = new Date();
    
    // Calculate mastery level
    existing.masteryLevel = this.calculateMasteryLevel(existing);
    
    // Update weak/strong areas
    this.updateSkillAreas(existing, lessonId, success);
    
    this.metrics.set(key, existing);
  }

  /**
   * Get recommended difficulty level for user
   */
  public getRecommendedDifficulty(userId: string): DifficultyLevel {
    const userMetrics = this.getUserMetrics(userId);
    const overallMastery = this.calculateOverallMastery(userMetrics);
    
    // Find highest difficulty level user can access
    for (let i = this.difficultyLevels.length - 1; i >= 0; i--) {
      const level = this.difficultyLevels[i];
      if (overallMastery >= level.requiredMastery) {
        return level;
      }
    }
    
    return this.difficultyLevels[0]; // Default to beginner
  }

  /**
   * Check if user can advance to next lesson
   */
  public canAdvance(userId: string, lessonId: string): boolean {
    const key = `${userId}-${lessonId}`;
    const metrics = this.metrics.get(key);
    
    if (!metrics) return false;
    
    return metrics.masteryLevel >= this.adaptiveConfig.masteryThreshold;
  }

  /**
   * Get personalized hints based on failure patterns
   */
  public getPersonalizedHints(userId: string, lessonId: string): Hint[] {
    const key = `${userId}-${lessonId}`;
    const metrics = this.metrics.get(key);
    
    if (!metrics) return [];
    
    const hints: Hint[] = [];
    
    // Analyze failure patterns
    if (metrics.failures > metrics.successes) {
      if (metrics.weakAreas.includes('capture')) {
        hints.push({
          id: 'capture-hint',
          type: 'visual',
          content: 'Look for stones with only one liberty remaining',
          penalty: this.adaptiveConfig.hintPenalty
        });
      }
      
      if (metrics.weakAreas.includes('territory')) {
        hints.push({
          id: 'territory-hint',
          type: 'textual',
          content: 'Territory is empty intersections surrounded by your stones',
          penalty: this.adaptiveConfig.hintPenalty
        });
      }
      
      if (metrics.weakAreas.includes('liberties')) {
        hints.push({
          id: 'liberty-hint',
          type: 'interactive',
          content: 'Click on stones to see their liberties highlighted',
          penalty: this.adaptiveConfig.hintPenalty
        });
      }
    }
    
    return hints;
  }

  /**
   * Generate adaptive learning path
   */
  public generateLearningPath(userId: string): LearningPath {
    const userMetrics = this.getUserMetrics(userId);
    const skillAssessment = this.skillAssessments.get(userId);
    const difficultyLevel = this.getRecommendedDifficulty(userId);
    
    const lessons: string[] = [];
    
    // Start with fundamentals
    lessons.push('basic-rules', 'liberty-counting');
    
    // Add based on skill assessment
    if (skillAssessment) {
      if (skillAssessment.captureAbility < 60) {
        lessons.push('capture-basics', 'single-capture', 'group-capture');
      }
      
      if (skillAssessment.territorialUnderstanding < 60) {
        lessons.push('territory-basics', 'territory-counting');
      }
      
      if (skillAssessment.tacticalThinking < 60) {
        lessons.push('tactical-patterns', 'ladder-recognition');
      }
    }
    
    // Add difficulty-appropriate lessons
    lessons.push(...difficultyLevel.unlocks);
    
    return {
      id: `path-${userId}`,
      name: `Personalized Path for ${difficultyLevel.name}`,
      lessons: [...new Set(lessons)], // Remove duplicates
      prerequisites: [],
      estimatedTime: lessons.length * 15, // 15 minutes per lesson
      difficulty: difficultyLevel.complexity
    };
  }

  /**
   * Assess user skills through diagnostic puzzles
   */
  public assessSkills(userId: string, responses: Map<string, any>): SkillAssessment {
    const assessment: SkillAssessment = {
      captureAbility: 0,
      territorialUnderstanding: 0,
      tacticalThinking: 0,
      strategicThinking: 0,
      patternRecognition: 0,
      overallRating: 0
    };
    
    // Analyze responses to calculate skill levels
    let totalQuestions = 0;
    let correctAnswers = 0;
    
    responses.forEach((response, questionId) => {
      totalQuestions++;
      if (response.correct) {
        correctAnswers++;
        
        // Weight by question type
        if (questionId.includes('capture')) {
          assessment.captureAbility += 20;
        } else if (questionId.includes('territory')) {
          assessment.territorialUnderstanding += 20;
        } else if (questionId.includes('tactical')) {
          assessment.tacticalThinking += 20;
        } else if (questionId.includes('strategic')) {
          assessment.strategicThinking += 20;
        } else if (questionId.includes('pattern')) {
          assessment.patternRecognition += 20;
        }
      }
    });
    
    // Normalize scores (0-100)
    Object.keys(assessment).forEach(key => {
      if (key !== 'overallRating') {
        assessment[key as keyof SkillAssessment] = Math.min(100, assessment[key as keyof SkillAssessment]);
      }
    });
    
    assessment.overallRating = Math.round(
      (assessment.captureAbility + 
       assessment.territorialUnderstanding + 
       assessment.tacticalThinking + 
       assessment.strategicThinking + 
       assessment.patternRecognition) / 5
    );
    
    this.skillAssessments.set(userId, assessment);
    return assessment;
  }

  /**
   * Get spaced repetition schedule
   */
  public getSpacedRepetitionSchedule(userId: string, lessonId: string): Date[] {
    const key = `${userId}-${lessonId}`;
    const metrics = this.metrics.get(key);
    
    if (!metrics) return [];
    
    const intervals = [
      1 * 24 * 60 * 60 * 1000,    // 1 day
      3 * 24 * 60 * 60 * 1000,    // 3 days
      7 * 24 * 60 * 60 * 1000,    // 1 week
      14 * 24 * 60 * 60 * 1000,   // 2 weeks
      30 * 24 * 60 * 60 * 1000    // 1 month
    ];
    
    const schedule: Date[] = [];
    let nextDate = new Date();
    
    intervals.forEach(interval => {
      nextDate = new Date(nextDate.getTime() + interval);
      schedule.push(nextDate);
    });
    
    return schedule;
  }

  /**
   * Get learning analytics for user
   */
  public getLearningAnalytics(userId: string): any {
    const userMetrics = this.getUserMetrics(userId);
    const skillAssessment = this.skillAssessments.get(userId);
    const difficultyLevel = this.getRecommendedDifficulty(userId);
    
    return {
      userId,
      difficultyLevel,
      skillAssessment,
      totalLessonsCompleted: userMetrics.filter(m => m.masteryLevel >= this.adaptiveConfig.masteryThreshold).length,
      averageMasteryLevel: this.calculateOverallMastery(userMetrics),
      weakAreas: this.identifyWeakAreas(userMetrics),
      strongAreas: this.identifyStrongAreas(userMetrics),
      learningVelocity: this.calculateLearningVelocity(userMetrics),
      recommendedFocus: this.getRecommendedFocus(userMetrics, skillAssessment)
    };
  }

  // Private helper methods
  private createNewMetrics(userId: string, lessonId: string): LearningMetrics {
    return {
      userId,
      lessonId,
      attempts: 0,
      successes: 0,
      failures: 0,
      timeSpent: 0,
      hintsUsed: 0,
      lastAttempt: new Date(),
      masteryLevel: 0,
      weakAreas: [],
      strongAreas: []
    };
  }

  private calculateMasteryLevel(metrics: LearningMetrics): number {
    if (metrics.attempts === 0) return 0;
    
    const successRate = metrics.successes / metrics.attempts;
    const timeBonus = Math.max(0, (300 - metrics.timeSpent) / 300) * this.adaptiveConfig.timeBonus;
    const hintPenalty = metrics.hintsUsed * this.adaptiveConfig.hintPenalty;
    
    return Math.min(100, Math.max(0, (successRate * 100) + timeBonus - hintPenalty));
  }

  private updateSkillAreas(metrics: LearningMetrics, lessonId: string, success: boolean): void {
    const skillArea = this.mapLessonToSkill(lessonId);
    
    if (success) {
      if (!metrics.strongAreas.includes(skillArea)) {
        metrics.strongAreas.push(skillArea);
      }
      // Remove from weak areas if present
      metrics.weakAreas = metrics.weakAreas.filter(area => area !== skillArea);
    } else {
      if (!metrics.weakAreas.includes(skillArea)) {
        metrics.weakAreas.push(skillArea);
      }
    }
  }

  private mapLessonToSkill(lessonId: string): string {
    if (lessonId.includes('capture')) return 'capture';
    if (lessonId.includes('territory')) return 'territory';
    if (lessonId.includes('liberty')) return 'liberties';
    if (lessonId.includes('life') || lessonId.includes('death')) return 'life-death';
    if (lessonId.includes('pattern') || lessonId.includes('joseki')) return 'patterns';
    return 'general';
  }

  private getUserMetrics(userId: string): LearningMetrics[] {
    const userMetrics: LearningMetrics[] = [];
    this.metrics.forEach((metrics, key) => {
      if (metrics.userId === userId) {
        userMetrics.push(metrics);
      }
    });
    return userMetrics;
  }

  private calculateOverallMastery(metrics: LearningMetrics[]): number {
    if (metrics.length === 0) return 0;
    
    const totalMastery = metrics.reduce((sum, m) => sum + m.masteryLevel, 0);
    return totalMastery / metrics.length;
  }

  private identifyWeakAreas(metrics: LearningMetrics[]): string[] {
    const areaCounts = new Map<string, number>();
    
    metrics.forEach(m => {
      m.weakAreas.forEach(area => {
        areaCounts.set(area, (areaCounts.get(area) || 0) + 1);
      });
    });
    
    return Array.from(areaCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([area]) => area);
  }

  private identifyStrongAreas(metrics: LearningMetrics[]): string[] {
    const areaCounts = new Map<string, number>();
    
    metrics.forEach(m => {
      m.strongAreas.forEach(area => {
        areaCounts.set(area, (areaCounts.get(area) || 0) + 1);
      });
    });
    
    return Array.from(areaCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([area]) => area);
  }

  private calculateLearningVelocity(metrics: LearningMetrics[]): number {
    if (metrics.length < 2) return 0;
    
    const sortedMetrics = metrics.sort((a, b) => 
      a.lastAttempt.getTime() - b.lastAttempt.getTime()
    );
    
    const firstMastery = sortedMetrics[0].masteryLevel;
    const lastMastery = sortedMetrics[sortedMetrics.length - 1].masteryLevel;
    const timeDiff = sortedMetrics[sortedMetrics.length - 1].lastAttempt.getTime() - 
                    sortedMetrics[0].lastAttempt.getTime();
    
    return (lastMastery - firstMastery) / (timeDiff / (24 * 60 * 60 * 1000)); // per day
  }

  private getRecommendedFocus(metrics: LearningMetrics[], skillAssessment?: SkillAssessment): string[] {
    const recommendations: string[] = [];
    
    // Based on weak areas
    const weakAreas = this.identifyWeakAreas(metrics);
    recommendations.push(...weakAreas);
    
    // Based on skill assessment
    if (skillAssessment) {
      if (skillAssessment.captureAbility < 70) recommendations.push('capture-practice');
      if (skillAssessment.territorialUnderstanding < 70) recommendations.push('territory-study');
      if (skillAssessment.tacticalThinking < 70) recommendations.push('tactical-puzzles');
      if (skillAssessment.strategicThinking < 70) recommendations.push('strategic-games');
      if (skillAssessment.patternRecognition < 70) recommendations.push('pattern-drills');
    }
    
    return [...new Set(recommendations)]; // Remove duplicates
  }
}

// Export singleton instance
export const adaptiveLearning = new AdaptiveLearningEngine();

// Export types for use in other modules
export type { LearningMetrics, DifficultyLevel, AdaptiveConfig, SkillAssessment, Hint, LearningPath };










