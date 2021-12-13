\version "2.22.1"
% original here: https://lilypond.org/doc/v2.21/Documentation/snippets/simultaneous-notes.it.html
voiceFive = #(context-spec-music (make-voice-props-set 4) 'Voice)

\markup { \abs-fontsize #7 \italic "6ème corde en ré" }

% Make a blank new fretboard table
#(define custom-fretboard
   (make-fretboard-table))

#(define RH rightHandFinger)

% Add a chord to custom-fretboard
\storePredefinedDiagram #custom-fretboard
\chordmode {d:m}
#guitar-tuning
"o;x;3-2;2-1;x;x;"
\storePredefinedDiagram #custom-fretboard
\chordmode {g:m}
#guitar-tuning
"x;5-3;5-4;3-1;x;o;"
\storePredefinedDiagram #custom-fretboard
\chordmode {a:7}
#guitar-tuning
"x;4-1;7-4;o;x;o;"
\storePredefinedDiagram #custom-fretboard
\chordmode {d:m2}
#guitar-tuning
"x;8-3;7-2;x;6-1;o;"
\storePredefinedDiagram #custom-fretboard
\chordmode {bes}
#guitar-tuning
"8-3;8-4;x;7-2;x;x;"
\storePredefinedDiagram #custom-fretboard
\chordmode {g:m2}
#guitar-tuning
"5-1;x;8-4;o;x;x;"
\storePredefinedDiagram #custom-fretboard
\chordmode {d:m3}
#guitar-tuning
"x;0;3-3;2-2;x;x;"

\score {
  \fixed c' {
    \time 3/4
    \key d \minor
    <<
      \partial 2

      \new FretBoards {
        \set predefinedDiagramTable = #custom-fretboard
        \chordmode {
          d2:m
          g4:m
          a2:7
          d4:m2
          bes2
          g4:m2
          d4:m3
        }
      }
      \new TabVoice {
        \set strokeFingerOrientations = #'(left)
        \set Staff.stringTunings = \stringTuning <d, a, d g b e'>
        <d,,-\RH #1 f,-\RH #2 a,-\RH #3 >2
        <d, g, bes, e>4
        <cis, g, a,\4 e>4.
        e8
        <d,, f,\5 a,\4 f\2>4
        <bes,,\6 f,\5 d\3>4
        c\3
        <g,,\6 bes,\4 g,\3>4
        <a,,\5 f,\4 a,\3>4
        <cis, g,>16 f, e, f,

      }

      \new Voice  {
        \voiceOne
        a4. a8 |
        e'4 e'4. e'8 |
        f'4 d'4. c'8 |
        bes4 a g16 f e f |
        g e f d
        %
        a4. a8 |
        e'4 e'4. e'8 |
        f'4 d'4. d'8 |
        bes'4 a'8. g'32 f' g'8. e'16 |
        f'8.
      }
      \new Voice {
        \voiceTwo
        d,2 |
        d4 cis2 |
        d,4 bes,2 |
        g,4 a, cis |
        d8 s
        %
        d,2 |
        d4 cis2 |
        d,4 bes,2 |
        g,4 a,8. s16 s4 |
        d8.
      }
      \new Voice {
        \voiceThree
        f2 |
        bes4 a2 |
        a4 s2 |
        g4 f s |
        s4
        %
        f2 |
        bes4 a2 |
        a4 s2 |
        d'4 cis'8. s16 s4 |
        d'8.
      }
      \new Voice {
        \voiceFive
        s2 |
        g4 g2 |
        f4 f2 |
        s4
        %
        s2 |
        s2. |
        g4 g2 |
        f4 f2 |
        e4 e8.
        %
      }
    >>

  }
  \layout {
    \override FretBoard.fret-diagram-details.finger-code = #'in-dot
    indent = #0
    \context {
      \TabVoice
      \override StrokeFinger.digit-names = ##("p" "i" "m" "a" "x")
      \consists "New_fingering_engraver"
    }

  }
  \midi {}
}