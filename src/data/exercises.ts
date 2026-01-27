import type { Exercise } from '../types';

export const exercises: Exercise[] = [
  {
    id: 'resentment_release',
    name: 'Resentment Release Technique',
    targetPattern: 'worries_negative',
    duration: '10-15 minutes daily',
    difficulty: 'medium',
    shortDescription: 'A structured process to identify and release resentment toward people or situations, freeing mental energy trapped in negative thought patterns.',
    fullInstructions: {
      overview: 'Resentment keeps your attention locked on negative thoughts and past events. This exercise helps you identify what you\'re holding onto and consciously release it, freeing your attention for more positive focus.',
      steps: [
        {
          step: 1,
          title: 'List Your Resentments',
          instruction: 'Write down people or situations you resent or haven\'t forgiven. Rate each 1-10 (1=mild dislike, 10=hatred).',
        },
        {
          step: 2,
          title: 'Hold Them in Mind',
          instruction: 'Pick the first person/situation. Instead of focusing on what they DID, simply hold an image of them in mind. Release labels and judgments while breathing softly. Try to feel the pain THEY must be in—hurt people hurt others.',
        },
        {
          step: 3,
          title: 'Forgive Them',
          instruction: 'Say mentally or aloud: "I acknowledge that you are a human being limited in understanding and prone to error. I forgive you for what you thought, said, and did. I release all resentment, revenge, or ill-will toward you. I release trying to change you. May you find peace and happiness."',
        },
        {
          step: 4,
          title: 'Repeat',
          instruction: 'Repeat the forgiveness statement 3-5 times. Then let go completely and direct attention to something pleasant in your current environment.',
        },
        {
          step: 5,
          title: 'Continue Daily',
          instruction: 'Work through your entire list over the 7 days. If physical sensations arise (tightness, nausea), this is stuck energy releasing—allow it.',
        },
      ],
      expectedOutcome: 'Reduced time spent on negative thoughts, increased mental freedom, possible warmth or softness in chest area.',
      warning: 'If overwhelming emotions arise, slow down. Work on smaller resentments first.',
    },
  },
  {
    id: 'priority_management',
    name: 'Priority Management / Love It or Leave It',
    targetPattern: 'scattered',
    duration: '15 minutes daily',
    difficulty: 'easy',
    shortDescription: 'Clarify what deserves your attention by deciding to either fully engage with things or stop giving them energy.',
    fullInstructions: {
      overview: 'Scattered attention happens when you\'re giving partial focus to too many things. This exercise forces clarity: fully commit or fully release.',
      steps: [
        {
          step: 1,
          title: 'List What You Want But Don\'t Have',
          instruction: 'Write down everything you say you want but haven\'t obtained. Be honest and comprehensive.',
        },
        {
          step: 2,
          title: 'Decision Time: Get It or Release It',
          instruction: 'For each item, write either: a) Concrete steps you\'ll take to get it in the near future, OR b) Deliberately let go of wanting it and cross it off.',
        },
        {
          step: 3,
          title: 'List What You Don\'t Like',
          instruction: 'Write down things you don\'t like in your current life (activities, situations, commitments).',
        },
        {
          step: 4,
          title: 'Decision Time: Leave It or Love It',
          instruction: 'For each item, decide: a) Leave it (stop investing time/attention), OR b) Practice embracing and loving it (shift your mental relationship to it).',
        },
        {
          step: 5,
          title: 'Daily Review',
          instruction: 'Each morning for 7 days, review your decisions. Take one concrete action on a "get it" item OR practice loving one "stay with it" item.',
        },
      ],
      expectedOutcome: 'Clearer priorities, reduced mental clutter, increased focus on what truly matters.',
      warning: 'Be ruthless. Half-commitments keep you scattered.',
    },
  },
  {
    id: 'presence_training',
    name: 'Presence Training - 60 Second Cycles',
    targetPattern: 'phone_media,planning_future',
    duration: '10 minutes daily',
    difficulty: 'medium',
    shortDescription: 'Train attention to stay in the present moment through timed cycles of focus between inner experience and outer environment.',
    fullInstructions: {
      overview: 'Your attention constantly drifts to past/future or gets absorbed in media. This trains you to anchor in the NOW through alternating focus.',
      steps: [
        {
          step: 1,
          title: 'Week 1: Neutral Outside (Eyes Open)',
          instruction: 'Set timer for 60 seconds. Focus entirely on your external environment—sights, sounds, textures. When mind wanders, gently return to sensory input. Do 10 cycles (10 minutes).',
        },
        {
          step: 2,
          title: 'Week 1: Neutral Inside (Eyes Closed)',
          instruction: 'Set timer for 60 seconds. Focus on internal experience—breathing, body sensations, subtle feelings. Do 10 cycles.',
        },
        {
          step: 3,
          title: 'Alternate Between Modes',
          instruction: '60 sec outside (eyes open) → 60 sec inside (eyes closed) → repeat. This trains flexible attention control.',
        },
        {
          step: 4,
          title: 'Progress to Positive Focus',
          instruction: 'After mastering neutral, spend 60 seconds on something you appreciate or enjoy in your environment. Then 60 seconds on a pleasant internal feeling.',
        },
        {
          step: 5,
          title: 'Daily Practice',
          instruction: 'Do this exercise once daily for 7 days. Notice if you can maintain present-moment awareness for longer periods naturally throughout your day.',
        },
      ],
      expectedOutcome: 'Increased ability to stay present, reduced automatic phone-checking, greater awareness of current moment.',
      warning: 'If you lose track of time, just restart. Don\'t judge yourself.',
    },
  },
  {
    id: 'first_day_on_earth',
    name: 'Your First Day on Earth',
    targetPattern: 'body_present_moment_low',
    duration: '20-30 minute walk daily',
    difficulty: 'easy',
    shortDescription: 'A walking meditation where you pretend everything is new, rekindling wonder and present-moment awareness.',
    fullInstructions: {
      overview: 'You take your environment for granted. This exercise rekindles curiosity and presence by pretending you\'re experiencing everything for the first time.',
      steps: [
        {
          step: 1,
          title: 'Set the Intention',
          instruction: 'Before your walk, decide: "I am seeing everything for the first time today." Release all preconceptions.',
        },
        {
          step: 2,
          title: 'Breathwork Pattern',
          instruction: 'On in-breath think "I am," on out-breath think "amazed." Repeat throughout your walk.',
        },
        {
          step: 3,
          title: 'Walk with Wonder',
          instruction: 'Look at familiar things as if you\'ve never seen them. Notice details you normally ignore. What would amaze you if this were truly your first day?',
        },
        {
          step: 4,
          title: 'Release Judgment',
          instruction: 'When impatience or judgment arises, breathe it in and release it on the out-breath. Return to silent wonder.',
        },
        {
          step: 5,
          title: 'Daily Practice',
          instruction: 'Take a 20-30 minute "first day" walk daily for 7 days. Use different routes to enhance the effect.',
        },
      ],
      expectedOutcome: 'Increased present-moment awareness, reduced taking-things-for-granted, childlike curiosity returns.',
      warning: 'This may feel silly at first. That\'s your adult mind resisting. Do it anyway.',
    },
  },
  {
    id: 'expanding_consciousness',
    name: 'Expanding Consciousness Exercise',
    targetPattern: 'worries_negative,past_memories',
    duration: '10 minutes daily',
    difficulty: 'easy',
    shortDescription: 'Deliberately notice things you haven\'t noticed before, expanding your awareness beyond habitual patterns.',
    fullInstructions: {
      overview: 'Your attention is stuck in habitual loops, noticing the same things repeatedly. This exercise forces you to notice NEW things, breaking the pattern.',
      steps: [
        {
          step: 1,
          title: 'Notice Physical Environment',
          instruction: 'Look at the walls of your room—notice something you haven\'t noticed before. Look out the window—notice something new. Examine an object closely until you see a detail you\'ve never consciously seen.',
        },
        {
          step: 2,
          title: 'Notice Your Body',
          instruction: 'Examine the skin on your arm until you notice something you haven\'t noticed before. Feel a sensation you haven\'t consciously felt in a long time.',
        },
        {
          step: 3,
          title: 'Notice Thoughts & Knowledge',
          instruction: 'Look at your stream of thoughts until you think something you haven\'t thought before. Open Wikipedia and learn something you didn\'t know.',
        },
        {
          step: 4,
          title: 'Notice Others',
          instruction: 'Look at a person you know well—notice something about them you\'ve never noticed. Read an old message—notice something you missed the first time.',
        },
        {
          step: 5,
          title: 'Daily Intention',
          instruction: 'Each day for 7 days, set the intention: "Today I will experience something I have not experienced before." Then actively look for it.',
        },
      ],
      expectedOutcome: 'Breaking habitual attention patterns, increased awareness, life feels more interesting.',
      warning: 'This is easier than it sounds. Don\'t overthink—just look with fresh eyes.',
    },
  },
  {
    id: 'concentration_training',
    name: 'Concentration Training - Breaking Habits',
    targetPattern: 'scattered',
    duration: '15 minutes daily + throughout day',
    difficulty: 'hard',
    shortDescription: 'Deliberately practice old and new habits to gain conscious control over automatic patterns.',
    fullInstructions: {
      overview: 'Scattered attention often comes from automatic habits running unconsciously. This exercise brings habits under conscious control.',
      steps: [
        {
          step: 1,
          title: 'Define the Old Habit',
          instruction: 'Write down the specific habit you want to release. Be concrete: "checking phone first thing after waking" not "phone addiction."',
        },
        {
          step: 2,
          title: 'Define the New Habit',
          instruction: 'Write the opposite or replacement habit: "doing 2 minutes of breathing first thing after waking."',
        },
        {
          step: 3,
          title: 'Act Out Old Habit DELIBERATELY',
          instruction: 'Do the old habit on purpose, consciously, with full awareness. You gain control over what you do intentionally. Do this once.',
        },
        {
          step: 4,
          title: 'Act Out New Habit DELIBERATELY',
          instruction: 'Do the new habit on purpose, consciously, with full awareness. Notice how it feels different.',
        },
        {
          step: 5,
          title: 'Alternate Consciously',
          instruction: 'For the next 7 days, intentionally switch between old and new habit (different days or times). After 7 days, only do the new habit. Never do the old habit unconsciously again.',
        },
      ],
      expectedOutcome: 'Conscious control over habits, reduced automatic behavior, increased focus.',
      warning: 'This requires discipline. Don\'t skip the "conscious old habit" step—it\'s crucial for gaining control.',
    },
  },
  {
    id: 'seeing_with_eyes_of_child',
    name: 'Seeing with the Eyes of a Child',
    targetPattern: 'past_memories,body_present_moment_low',
    duration: 'Throughout the day awareness',
    difficulty: 'medium',
    shortDescription: 'Recover childlike presence by letting go of "already knowing" and experiencing familiar things as if new.',
    fullInstructions: {
      overview: 'Adults lose joy because they think they\'ve "already seen/done/experienced" everything. This exercise recovers beginner\'s mind.',
      steps: [
        {
          step: 1,
          title: 'Identify Dulled Experiences',
          instruction: 'List 3-5 things you experience daily that you\'ve become numb to: your office, your partner, your commute, your home.',
        },
        {
          step: 2,
          title: 'Release "Already Knowing"',
          instruction: 'For each item, notice your expectation: "I already know what the office looks like." Recognize this is your MIND\'s recording, not reality.',
        },
        {
          step: 3,
          title: 'Experience as First Time',
          instruction: 'Approach the familiar as if for the first time. Your office: What would you notice if you\'d never been there? Your partner: What would excite you about them if you just met?',
        },
        {
          step: 4,
          title: 'Shift Perception Point',
          instruction: 'Ask: What would a child notice? An artist? A detective? A visitor from another country? Shift WHO is perceiving to see differently.',
        },
        {
          step: 5,
          title: 'Daily Practice',
          instruction: 'Each day for 7 days, pick ONE familiar thing and experience it as if for the first time. Notice increased aliveness.',
        },
      ],
      expectedOutcome: 'Recovered sense of wonder, increased joy in familiar experiences, feeling more present.',
      warning: 'Your mind will resist ("this is stupid, I already know this place"). Notice that resistance and proceed anyway.',
    },
  },
  {
    id: 'psychonavigation_basics',
    name: 'Psychonavigation - Directing Attention Intentionally',
    targetPattern: 'planning_future,worries_negative',
    duration: '10 minutes daily',
    difficulty: 'hard',
    shortDescription: 'Train your ability to direct attention where you choose, rather than where habit takes it.',
    fullInstructions: {
      overview: 'Most people\'s attention is on autopilot. Psychonavigation means consciously steering your attention to better thoughts/experiences.',
      steps: [
        {
          step: 1,
          title: '60-Second Neutral Focus',
          instruction: 'Set timer. Focus on something neutral (a wall, your breath, a sound). When attention wanders, return it. Just 60 seconds.',
        },
        {
          step: 2,
          title: '60-Second Positive Focus',
          instruction: 'Set timer. Focus on something you appreciate, love, or enjoy. Hold it in attention. Notice the feeling it creates.',
        },
        {
          step: 3,
          title: 'Alternate: Neutral → Positive',
          instruction: 'Do 5 cycles: 60 sec neutral, 60 sec positive. This trains flexible, intentional attention control.',
        },
        {
          step: 4,
          title: 'Challenge: Include Negative',
          instruction: 'Advanced: Add 60 sec on something mildly unpleasant. Then immediately switch to neutral. Then positive. This trains you to NOT get stuck in negative.',
        },
        {
          step: 5,
          title: 'Daily Life Application',
          instruction: 'Throughout your day, notice when attention drifts to worry/planning. Practice steering it back to neutral or positive. Use the 60-second technique anytime.',
        },
      ],
      expectedOutcome: 'Increased control over attention, ability to "unstick" from negative thoughts, more time in positive states.',
      warning: 'This is mental exercise, like lifting weights. It gets easier with practice but requires consistent effort.',
    },
  },
];

export function getExerciseById(id: string): Exercise | undefined {
  return exercises.find(e => e.id === id);
}
