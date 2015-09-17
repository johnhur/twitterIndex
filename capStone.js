
// Choice1 = new Mongo.Collection('choice1')
// Choice2 = new Mongo.Collection('choice2')
Competition = new Mongo.Collection('competition') 

// having a new instance collection, having name and hashes as parameters.. 

if (Meteor.isClient) {

  Accounts.ui.config({
     passwordSignupFields: "USERNAME_ONLY"
   });
  
  angular.module('tweet-vote', ['angular-meteor', 'chart.js']);

  angular.module('tweet-vote').controller('CapStoneCtrl', ['$scope', '$meteor',
    function($scope, $meteor) {
      // $scope.tweets1 = $meteor.collection(Choice1)
      // $scope.tweets2 = $meteor.collection(Choice2)
      $scope.competition = $meteor.collection(Competition)

      // remodeling the data..
      var data3 = $scope.getCollectionReactively('competition')

      $scope.createPoll = function(){
       var comp = Competition.insert({
          name: $scope.competitionName,
          key1: {
            word: $scope.userInput1, 
            tweets: [] 
          },
          key2: {
            word: $scope.userInput2,
            tweets: []
          }
        })
       console.log(comp)
      }

     $meteor.autorun($scope, function(){
       // var data1 = $scope.getCollectionReactively('tweets1')
       // var data2 = $scope.getCollectionReactively('tweets2')

        // owner key on competition
        // url = competition/:id
        
        // newScore1 = data.key1.tweets.length
        // newScore2 = data.key2.tweets.length

      // } else {
      // newScore1 = data.key1.tweets.length
      // newScore2 = data.key2.tweets.length

      // $scope.labels = [$scope.userInput1, $scope.userInput2];
      // $scope.data = [newScore1, newScore2]  
    

    })
       //this runs everytime collection updates
      // $meteor.collection(Tweets).forEach(function(t){
      //   if ("#" + t.choice == $scope.userInput1){
      //     newScore1 += 1
      //     console.log("SCORE FOR 1: " + newScore1)
      //   }
      //   else if("#" + t.choice == $scope.userInput2){
      //     newScore2 += 1
      //     console.log("SCORE FOR 2: " + newScore2)
      //   }
      //   else{
      //     console.log("NOOOO")
      //   }
      // })


  $scope.getTweets = function (word1, word2){
  	$meteor.call('getTweets', word1, word2);
	}

  $scope.stopStream = function(){
    $meteor.call('stopStream')
  }

}])
}

if (Meteor.isServer){

Meteor.methods({
	getTweets: function(word1, word2) {
    console.log("******* GETTING TWEETS *****")
      var user = {}
		    stream = T.stream('statuses/filter', { track: [word1, word2] })

        stream.on('disconnect', function (disconnectMessage) {
          console.log("DISCONNECTED")
        })

        stream.on('limit', function (limitMessage) {
          console.log("limit message: " + limitMessage.message)
        })

        stream.on('error', function (error) {
          console.log("error message: " + error.message)
        })
        
        stream.on('tweet', Meteor.bindEnvironment(function (tweet) {
          
          // console.log(tweet["entities"]["hashtags"][0].text);
          (tweet["entities"]["hashtags"]).forEach(function(hash){
            if("#" + hash.text == word1){
              user.choice = hash.text
              user.name = tweet["user"]["name"]
              user.text = tweet["text"]

                // Competition.insert({
                //   choice1: {
                //     word: "CAT", 
                //     tweets: ["savannah's are cute", "I love blue cats"] 
                //   },
                //   choice2: {
                //     word: "dog",
                //     tweets: ["frenchy's rule", "dogs are smelly"]
                //   }
                // })

              // Choice1.insert({
              //   name: user.name,
              //   text: user.text,
              //   choice: user.choice,
              //   owner: Meteor.userId()
              // });
            }
            else if("#" + hash.text == word2){
              user.choice = hash.text
              user.name = tweet["user"]["name"]
              user.text = tweet["text"]

                // Competition.insert({
                //   key1: {
                //     word: "CAT", 
                //     tweets: ["savannah's are cute", "I love blue cats"] 
                //   },
                //   key2: {
                //     word: "dog",
                //     tweets: ["frenchy's rule", "dogs are smelly"]
                //   }
                // })
              }

              })

              // Choice2.insert({
              //   name: user.name,
              //   text: user.text,
              //   choice: user.choice,
              //   owner: Meteor.userId()
              // });


              }))

              // Competition.insert({
              //   key1: {
              //     word: "CAT", 
              //     tweets: ["savannah's are cute", "I love blue cats"] 
              //   },
              //   key2: {
              //     word: "dog",
              //     tweets: ["frenchy's rule", "dogs are smelly"]
              //   }
              // })
          
          },
          //     Competition.insert({
          //       key1.tweets.push(hash.text)
          //     });
          //   }

                     //  Tweets.insert({
          //   competition_name: exampledId,
          //   word: "cat",
          //   phrase: "cats rule"
          // })
          
          // once I input new search parameters on client, 
          // the user.choice becomes null for all tweets in database. 

            // if(user.choice == null){

            // Choice1.insert({
            //   name: user.name,
            //   text: user.text,
            //   choice: user.choice
            // });
            // user = {}
            // }
  
    stopStream: function() {
      stream.stop()
    }

  });

Meteor.startup(function(){
  // code to run on server at startup
  // ***** .env and .gitignore files ***** 
  Twit = Meteor.npmRequire('twit');
  T = new Twit({
    consumer_key: "O8oj6DrDmnpfX3vnp22GGNha7",
    consumer_secret: "AbxCwN5OTVmD2TCnaW42dJnPddlhRXemQFO6Wp023ZFeNHi6Uq",
    access_token: "429220099-FqFX3lpEypyiiyfmQPOs1XTqw5DdFJwsJSN0kETn",
    access_token_secret: "sC76qKyDXJ4XEsSdIGPpvR4oBa2Uox9WLSSoXe3YsGl0X"
  })
  console.log("*****CONNECTED TO TWITTER STREAM*****")
});

}



