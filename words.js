// Built-in starter lists. Gameplay also accepts any 5-letter A-Z guess so common words are always playable.
const ANSWER_WORDS = [
  'cigar','rebut','sissy','humph','awake','blush','focal','evade','naval','serve','heath','dwarf','model','karma','stink','grade','quiet','bench','abate','feign',
  'major','death','fresh','crust','stool','colon','abase','marry','react','batty','pride','floss','helix','croak','staff','paper','unfed','whelp','trawl','outdo',
  'adobe','crazy','sower','repay','digit','crate','cluck','spike','mimic','pound','maxim','linen','unmet','flesh','booby','forth','first','stand','belly','ivory',
  'seedy','print','yearn','drain','bribe','stout','panel','crass','flume','offal','agree','error','swirl','argue','bleed','delta','flick','totem','wooer','front',
  'shrub','parry','biome','lapel','start','greet','goner','golem','lusty','loopy','round','audit','lying','gamma','labor','islet','civic','forge','corny','moult',
  'basic','salad','agate','spicy','spray','essay','fjord','spend','kebab','guild','aback','motor','alone','hatch','hyper','thumb','dowry','ought','belch','dutch',
  'pilot','tweed','comet','jaunt','enema','steed','abyss','growl','fling','dozen','boozy','erode','world','gouge','click','briar','great','altar','pulpy','blurt',
  'coast','duchy','groin','fixer','group','rogue','badly','smart','pithy','gaudy','chill','heron','vodka','finer','surer','radio','rouge','perch','retch','wrote',
  'clock','tilde','store','prove','bring','solve','cheat','grime','exult','usher','epoch','triad','break','rhino','viral','conic','masse','sonic','vital','trace',
  'using','peach','champ','baton','brake','pluck','craze','gripe','weary','picky','acute','ferry','aside','tapir','troll','unify','rebus','boost','truss','siege'
];

const EXTRA_GUESSES = [
  'candy','could',  'about','other','which','their','there','would','could','house','place','after','again','small','right','think','three','great','where','never','under','while',
  'light','might','sound','found','plant','water','below','every','heart','earth','short','class','point','young','story','times','white','black','green','brown',
  'sugar','spoon','knife','bread','apple','grape','mango','lemon','melon','berry','pearl','shark','whale','zebra','eagle','tiger','snake','horse','sheep','goose',
  'adieu','stare','slate','crane','arise','tears','rates','later','irate','least','alert','alter','raise','ratio','soare','ouija','roate','alone','stone','swept',
  'tares','lares','rales','reais','aeros','orate','learn','smile','grind','sling','charm','latch','brick','vague','jazzy','queue','xenon','zesty','couch','daisy'
];

const ALLOWED_WORDS = [...new Set([...ANSWER_WORDS, ...EXTRA_GUESSES])];
