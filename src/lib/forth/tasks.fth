\ app backend in forth because i'm insane
\ all entries are stored in the stack. format per entry is <flag> <addr> <len>

3 CONSTANT SIZE


\ technically any undefined word will clear the stack (nuts) but let's define it anyway
: CLEARSTACK  DEPTH 0 ?DO DROP LOOP ;
\ redundant but useful ig
: CLEAR  CLEARSTACK ;

: ROLLSTACK ( -- )  DEPTH 1- ROLL ;
: ROLLN ( n times -- )  0 DO DUP >R ROLL R> LOOP DROP ;
: ROLLNSTACK ( times -- )  DEPTH 2 - SWAP ROLLN ;



\ dump state to out stream
\ format is newline-separated "<flag> <text>"
\ TODO
: DUMP ( -- )
  ;

\ append is only -> 0 S" stuff"

\ this took hours.
: TOGGLE ( n -- )
  SIZE * 1+ DUP >R ROLLNSTACK  \ roll to the first part of the index
  INVERT
  DEPTH 1- R> -
  ROLLNSTACK ;

  \ this was a horrible WIP implementation
  \ 2 \ n 2
  \ * \ n*2
  \ DEPTH \ n*2 depth
  \ SWAP \ depth n*2
  \ - \ depth-n*2
  \ 1- \ depth-n*2-1
  \ 0 \ depth-n*2-1 0
  \ DO
  \ >R
  \ LOOP ;

: REMOVE ( n -- )
  SIZE * 1+ DUP >R ROLLNSTACK
  DROP ROLLSTACK
  DROP ROLLSTACK
  DROP
  \ TODO
  DEPTH 1- R> -
  ROLLNSTACK ;