(defproject red-eagle "0.1.0-SNAPSHOT"
  :description "Red Eagle in a Ring"
  :license {:name "MIT"}
  :plugins [[lein-ring "0.8.11"]]
  :dependencies [
    [org.clojure/clojure "1.6.0"]
    [ring/ring-core "1.3.2"]
    [ring/ring-jetty-adapter "1.3.2"]]
  :target-path "target/%s"
  :profiles {:uberjar {:aot :all}}
  :ring {:handler inflight.core/app}
  :main ^:skip-aot inflight.core)
